import { z } from "zod";
import { rateLimit } from "@/lib/auth";
import { createLiveKitToken, livekitConfigured } from "@/lib/livekit";

export const dynamic = "force-dynamic";

const schema = z.object({ sessionId: z.string().trim().min(6).max(80) });

/**
 * Mints a short-lived LiveKit access token so the browser can join a
 * per-session real-time room. No secrets reach the client: the API key and
 * secret stay server-side, only the signed JWT is returned.
 */
export async function POST(request: Request) {
  if (!livekitConfigured()) {
    return Response.json(
      { error: "Live voice sessions are not configured on this deployment (LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET missing)." },
      { status: 503 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`livekit:${forwarded.split(",")[0].trim()}`, 20, 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Too many live-session requests. Please wait a minute." }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "A valid sessionId is required" }, { status: 422 });
  }

  try {
    const session = await createLiveKitToken(parsed.data.sessionId);
    return Response.json(session);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not create a live voice session" },
      { status: 500 },
    );
  }
}
