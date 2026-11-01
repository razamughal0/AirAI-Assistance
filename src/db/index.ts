import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import { SCHEMA_STATEMENTS } from "./schema-ddl";

const LOCAL_DEV_FALLBACK = "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

let databaseUrl = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");

if (!databaseUrl) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      [
        "DATABASE_URL is required but was not found in the environment.",
        "Create a '.env' file in the project root (same folder as package.json) with a line like:",
        "  DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db",
        "See '.env.example' for a template, and the README 'Run locally on Windows' section for step-by-step setup.",
      ].join("\n"),
    );
  }
  // Local development convenience: if the '.env' file did not make it into a
  // downloaded copy of this project (common when zipping/downloading, since
  // many tools skip dotfiles), fall back to the standard local Postgres URL.
  databaseUrl = LOCAL_DEV_FALLBACK;
  console.warn(
    "\n[air-university-assistant] DATABASE_URL was not found in your environment.\n" +
      `[air-university-assistant] Falling back to the local default: ${LOCAL_DEV_FALLBACK}\n` +
      "[air-university-assistant] If this is wrong, create a '.env' file in the project root with your own DATABASE_URL.\n",
  );
}

/**
 * Build pool options from DATABASE_URL while handling `sslmode` ourselves.
 *
 * Newer versions of `pg` print a SECURITY WARNING whenever the URL contains
 * sslmode=prefer|require|verify-ca (they are currently aliases of
 * verify-full and will change meaning in pg v9). Instead of leaving that
 * ambiguity (and the noisy warning) in place, we strip `sslmode` from the URL
 * and translate it into an explicit `ssl` option with libpq semantics:
 *
 *   disable            -> no TLS
 *   require / prefer   -> TLS, certificate not verified   (what libpq does)
 *   verify-ca / full   -> TLS with certificate verification
 *   (nothing, local)   -> no TLS for localhost / 127.0.0.1 / ::1
 *   (nothing, remote)  -> TLS without verification (hosted DBs need TLS)
 */
export function buildPoolConfig(rawUrl: string): PoolConfig {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    // Not a parseable URL (e.g. unusual libpq key/value DSN) — let pg handle it.
    return { connectionString: rawUrl };
  }

  const sslmode = (url.searchParams.get("sslmode") ?? "").toLowerCase();
  const sslFlag = (url.searchParams.get("ssl") ?? "").toLowerCase();
  url.searchParams.delete("sslmode");
  url.searchParams.delete("uselibpqcompat");
  url.searchParams.delete("sslrootcert");

  const host = url.hostname.toLowerCase();
  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]" || host === "";

  let ssl: PoolConfig["ssl"];
  if (sslmode === "disable" || sslFlag === "false" || sslFlag === "0") {
    ssl = false;
  } else if (sslmode === "verify-ca" || sslmode === "verify-full") {
    ssl = { rejectUnauthorized: true };
  } else if (sslmode === "require" || sslmode === "prefer" || sslmode === "allow" || sslFlag === "true" || sslFlag === "1") {
    // A local Postgres on a laptop normally has no TLS; forcing it would make
    // every query fail with "The server does not support SSL connections".
    ssl = isLocal ? false : { rejectUnauthorized: false };
  } else {
    ssl = isLocal ? false : { rejectUnauthorized: false };
  }

  return {
    connectionString: url.toString(),
    ssl,
    // Fail fast with a readable error instead of hanging if Postgres is down.
    connectionTimeoutMillis: 8000,
    max: 10,
  };
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __auSchemaPromise?: Promise<void>;
};

export const pool = globalForDb.__arenaNextJsPostgresqlPool ?? new Pool(buildPoolConfig(databaseUrl));

pool.on("error", (error) => {
  console.error(
    "\n[air-university-assistant] Lost connection to PostgreSQL:",
    error.message,
    "\n[air-university-assistant] Make sure PostgreSQL is installed and running, and that DATABASE_URL in '.env' points to it.\n",
  );
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);

/**
 * Idempotently create every table/index the app needs.
 *
 * This is what makes a *fresh, empty* database work on first launch: without
 * it, the very first query ("select ... from app_settings") fails with
 * `relation "app_settings" does not exist` unless the developer remembered to
 * run `npx drizzle-kit push` first. Running `drizzle-kit push` is still
 * supported and recommended, this is just a safety net.
 *
 * Uses a Postgres advisory lock so concurrent requests (Next dev spawns
 * several workers) never race while creating tables.
 */
export function ensureSchema(): Promise<void> {
  if (!globalForDb.__auSchemaPromise) {
    globalForDb.__auSchemaPromise = (async () => {
      const client = await pool.connect();
      try {
        await client.query("select pg_advisory_lock(728812)");
        try {
          for (const statement of SCHEMA_STATEMENTS) {
            await client.query(statement);
          }
        } finally {
          await client.query("select pg_advisory_unlock(728812)").catch(() => undefined);
        }
      } finally {
        client.release();
      }
    })().catch((error) => {
      // Allow a retry on the next request (e.g. Postgres was still starting).
      globalForDb.__auSchemaPromise = undefined;
      throw error;
    });
  }
  return globalForDb.__auSchemaPromise;
}
