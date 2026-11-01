import { describe, expect, it } from "vitest";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
const { buildPoolConfig } = await import("@/db");
const { rootCauseMessage, friendlyDatabaseError, isMissingTableError, isDatabaseConnectivityError } = await import("@/lib/db-error");

describe("buildPoolConfig (sslmode handling — fixes the pg SECURITY WARNING)", () => {
  it("strips sslmode from the URL so pg never prints the SECURITY WARNING", () => {
    for (const mode of ["require", "prefer", "verify-ca", "verify-full", "disable"]) {
      const cfg = buildPoolConfig(`postgresql://u:p@db.example.com:5432/app?sslmode=${mode}`);
      expect(cfg.connectionString).not.toMatch(/sslmode/i);
    }
  });

  it("never forces TLS on a local Postgres (typical Windows install has no SSL)", () => {
    expect(buildPoolConfig("postgresql://postgres:pw@127.0.0.1:5432/app_db?sslmode=require").ssl).toBe(false);
    expect(buildPoolConfig("postgresql://postgres:pw@localhost:5432/app_db?sslmode=prefer").ssl).toBe(false);
    expect(buildPoolConfig("postgresql://postgres:pw@localhost:5432/app_db").ssl).toBe(false);
  });

  it("uses TLS without certificate verification for sslmode=require on hosted databases (libpq semantics)", () => {
    expect(buildPoolConfig("postgresql://u:p@ep-x.neon.tech/app?sslmode=require").ssl).toEqual({ rejectUnauthorized: false });
  });

  it("verifies certificates for verify-ca / verify-full", () => {
    expect(buildPoolConfig("postgresql://u:p@db.example.com/app?sslmode=verify-full").ssl).toEqual({ rejectUnauthorized: true });
    expect(buildPoolConfig("postgresql://u:p@db.example.com/app?sslmode=verify-ca").ssl).toEqual({ rejectUnauthorized: true });
  });

  it("honours sslmode=disable and preserves other query params", () => {
    const cfg = buildPoolConfig("postgresql://u:p@db.example.com/app?sslmode=disable&application_name=au");
    expect(cfg.ssl).toBe(false);
    expect(cfg.connectionString).toContain("application_name=au");
  });
});

describe("database error helpers", () => {
  it("unwraps the real cause hidden behind Drizzle's 'Failed query' message", () => {
    const real = Object.assign(new Error('relation "app_settings" does not exist'), { code: "42P01" });
    const wrapped = Object.assign(new Error("Failed query: select * from app_settings"), { cause: real });
    expect(rootCauseMessage(wrapped)).toContain('relation "app_settings" does not exist');
    expect(isMissingTableError(wrapped)).toBe(true);
  });

  it("gives specific, actionable guidance for the common local-setup failures", () => {
    const auth = Object.assign(new Error("x"), { cause: Object.assign(new Error("password authentication failed for user postgres"), { code: "28P01" }) });
    expect(friendlyDatabaseError(auth)).toMatch(/password/i);
    const nodb = Object.assign(new Error("x"), { cause: new Error('database "app_db" does not exist') });
    expect(friendlyDatabaseError(nodb)).toMatch(/createdb|Create/i);
    const down = Object.assign(new Error("x"), { cause: Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:5432"), { code: "ECONNREFUSED" }) });
    expect(isDatabaseConnectivityError(down)).toBe(true);
    expect(friendlyDatabaseError(down)).toMatch(/running/i);
  });
});
