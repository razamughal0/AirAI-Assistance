import { AccessToken } from "livekit-server-sdk";

/**
 * LiveKit provides the real-time audio transport for "Live Voice Mode": once
 * connected, a human admissions staffer or a future server-side voice agent
 * worker can join the same room to listen/speak. The assistant's own
 * question-answering still runs through the fast Gemini-backed chat API and
 * the browser's microphone/speech-synthesis, because a persistent
 * LiveKit Agent (STT -> LLM -> TTS loop) requires a long-lived worker process
 * that is out of scope for this serverless Next.js deployment — see README.
 */

export function livekitConfigured(): boolean {
  return Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);
}

export function livekitPublicUrl(): string | null {
  return process.env.LIVEKIT_URL ?? null;
}

function sanitizeIdentifier(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || "guest";
}

export async function createLiveKitToken(sessionId: string): Promise<{ token: string; url: string; roomName: string; identity: string }> {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.LIVEKIT_URL;
  if (!apiKey || !apiSecret || !url) {
    throw new Error("LiveKit is not configured (LIVEKIT_URL/LIVEKIT_API_KEY/LIVEKIT_API_SECRET missing)");
  }
  const identity = `visitor-${sanitizeIdentifier(sessionId)}`;
  const roomName = `au-assistant-${sanitizeIdentifier(sessionId)}`;

  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: "30m" });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  const token = await at.toJwt();
  return { token, url, roomName, identity };
}
