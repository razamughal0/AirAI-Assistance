import { db, ensureSchema } from "@/db";
import { documents } from "@/db/schema";
import { desc } from "drizzle-orm";
import { defaultLlmConfig } from "@/lib/config";
import { livekitConfigured } from "@/lib/livekit";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    await ensureSchema().catch(() => undefined);
    let indexedDocuments: number | null = null;
    let lastDocumentUpdate: string | null = null;
    try {
      const rows = await db
        .select({ id: documents.id, updatedAt: documents.updatedAt })
        .from(documents)
        .orderBy(desc(documents.updatedAt))
        .limit(1);
      const counts = await db.execute<{ count: number }>(sql`select count(*)::int as count from documents`);
      indexedDocuments = Number(counts.rows[0]?.count ?? 0);
      lastDocumentUpdate = rows[0]?.updatedAt?.toISOString() ?? null;
    } catch {
      indexedDocuments = null;
    }
    return Response.json({
      ok: true,
      service: "air-university-knowledge-assistant",
      database: "connected",
      indexedDocuments,
      lastDocumentUpdate,
      llm: {
        provider: defaultLlmConfig.provider,
        model: defaultLlmConfig.model,
        googleKeyConfigured: Boolean(process.env.GOOGLE_API_KEY),
      },
      liveKitConfigured: livekitConfigured(),
      time: new Date().toISOString(),
    });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
