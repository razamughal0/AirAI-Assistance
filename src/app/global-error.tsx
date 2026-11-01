"use client";

import { useEffect } from "react";

/**
 * Root-level fallback used only if the error happens above the normal error
 * boundary (for example inside the root layout itself). Kept deliberately
 * dependency-free since Tailwind/layout may not have mounted.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[air-university-assistant] Fatal root error:", error);
  }, [error]);

  const dbIssue = /DATABASE_URL|ECONNREFUSED|password authentication|getaddrinfo/i.test(error?.message ?? "");

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f5f6f8", color: "#12233c", margin: 0 }}>
        <main style={{ maxWidth: 640, margin: "80px auto", padding: 24, background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>
            {dbIssue ? "The app can't reach your PostgreSQL database" : "Something went wrong"}
          </h1>
          {dbIssue ? (
            <>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                Create a <code>.env</code> file in your project root (next to <code>package.json</code>) containing:
              </p>
              <pre style={{ background: "#0b1f3a", color: "#f1f5f9", padding: "10px 12px", borderRadius: 8, fontSize: 12, overflowX: "auto" }}>
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
              </pre>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                Then make sure PostgreSQL is installed and running on your machine, and restart <code>npm run dev</code>.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Please try again, or check your terminal logs for details.</p>
          )}
          <p style={{ fontSize: 11, color: "#64748b" }}>{error.message.slice(0, 200)}</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 12, background: "#0b1f3a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
