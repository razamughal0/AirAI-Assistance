/**
 * Drizzle wraps the real PostgreSQL/driver error in `DrizzleQueryError`
 * ("Failed query: select ...") and hides the useful part in `.cause`.
 * These helpers dig it out so logs and UI show the *actual* problem.
 */
export function rootCauseMessage(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  let depth = 0;
  while (current && depth < 6) {
    if (current instanceof Error) {
      if (current.message) parts.push(current.message);
      const code = (current as { code?: string }).code;
      if (code) parts.push(`code=${code}`);
      current = (current as { cause?: unknown }).cause;
    } else {
      parts.push(String(current));
      break;
    }
    depth += 1;
  }
  return parts.join(" | ");
}

export function isDatabaseConnectivityError(error: unknown): boolean {
  return /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|password authentication|database ".*" does not exist|getaddrinfo|Connection terminated|client password must be a string|self-signed certificate|does not support SSL|DATABASE_URL|timeout expired|57P03|28P01|3D000/i.test(
    rootCauseMessage(error),
  );
}

export function isMissingTableError(error: unknown): boolean {
  return /relation ".*" does not exist|42P01/i.test(rootCauseMessage(error));
}

/** Log the *real* cause once, in a readable single block (instead of a wall of stack frames). */
export function logDatabaseError(context: string, error: unknown) {
  console.error(`[air-university-assistant] ${context}: ${rootCauseMessage(error)}`);
}

export function friendlyDatabaseError(error: unknown): string {
  const detail = rootCauseMessage(error);
  if (/password authentication|28P01/i.test(detail)) {
    return "PostgreSQL rejected the username/password in DATABASE_URL. Update the password in your '.env' file to the one you set when installing PostgreSQL, then restart 'npm run dev'.";
  }
  if (/database ".*" does not exist|3D000/i.test(detail)) {
    return "The database named in DATABASE_URL does not exist yet. Create it (pgAdmin → Create → Database → 'app_db', or run: createdb app_db), then restart 'npm run dev'.";
  }
  if (/does not support SSL/i.test(detail)) {
    return "Your PostgreSQL server does not use SSL, but DATABASE_URL asks for it. Remove '?sslmode=require' from DATABASE_URL in '.env'.";
  }
  if (isDatabaseConnectivityError(error)) {
    return (
      "Could not reach PostgreSQL. Make sure PostgreSQL is installed and running (Windows: Services → postgresql-x64-NN → Running), " +
      "and that DATABASE_URL in your '.env' file is correct (e.g. postgresql://postgres:<password>@127.0.0.1:5432/app_db). " +
      `Technical detail: ${detail.slice(0, 160)}`
    );
  }
  return detail.slice(0, 240) || "Unexpected server error";
}
