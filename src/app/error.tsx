"use client";

import { useEffect, useMemo } from "react";

function isDatabaseError(message: string): boolean {
  return /DATABASE_URL|ECONNREFUSED|password authentication|does not exist|connect ETIMEDOUT|self-signed certificate|Connection terminated|client password must be a string|getaddrinfo/i.test(
    message,
  );
}

export default function GlobalErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[air-university-assistant] Unhandled page error:", error);
  }, [error]);

  const dbIssue = useMemo(() => isDatabaseError(error?.message ?? ""), [error]);

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b1f3a] ring-1 ring-[#c8a24a]/50">
          <img src="/images/au-mark-white.svg" alt="" className="h-9 w-9" />
        </span>

        {dbIssue ? (
          <>
            <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-rose-600">Setup needed</p>
            <h1 className="mt-1 font-serif text-xl text-[#0b1f3a]">The app can&rsquo;t reach your PostgreSQL database</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              This is a local setup issue, not a bug in the code. It almost always means one of two things:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] leading-relaxed text-slate-700">
              <li>
                There is no <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">.env</code> file in your
                project folder (common when a project is downloaded as a ZIP — tools often skip files that start with a
                dot). Create one next to <code className="font-mono">package.json</code> containing:
                <pre className="mt-1.5 overflow-x-auto rounded-lg bg-[#0b1f3a] px-3 py-2 text-[11.5px] text-slate-100">
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
                </pre>
              </li>
              <li>PostgreSQL is not installed or not running on your machine yet (see the README &ldquo;Run locally on Windows&rdquo; section for exact steps).</li>
            </ol>
            <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-[11.5px] leading-relaxed text-slate-500">
              Roman Urdu: Ye code ka masla nahi, local setup ka step reh gaya hai. Project folder mein <strong>.env</strong> naam
              ki file banayein (upar wali line copy karein), PostgreSQL install/run karein, phir dobara try karein.
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Technical detail: <code className="font-mono">{error.message.slice(0, 200)}</code>
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-rose-600">Something went wrong</p>
            <h1 className="mt-1 font-serif text-xl text-[#0b1f3a]">This page hit an unexpected error</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Please try again. If this keeps happening, check the server logs in your terminal for the full error.
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Technical detail: <code className="font-mono">{error.message.slice(0, 200)}</code>
            </p>
          </>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-[#0b1f3a] px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#17375f]"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-600">
            Back to home
          </a>
        </div>
      </div>
    </main>
  );
}
