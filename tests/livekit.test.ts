import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("LiveKit configuration + token minting", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    process.env.LIVEKIT_API_KEY = "test-key";
    process.env.LIVEKIT_API_SECRET = "test-secret-at-least-32-chars-long!!";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("reports configured when all three env vars are present", async () => {
    const { livekitConfigured } = await import("@/lib/livekit");
    expect(livekitConfigured()).toBe(true);
  });

  it("reports not configured when any env var is missing", async () => {
    delete process.env.LIVEKIT_API_SECRET;
    const { livekitConfigured } = await import("@/lib/livekit");
    expect(livekitConfigured()).toBe(false);
  });

  it("mints a signed JWT scoped to a per-session room without leaking the secret", async () => {
    const { createLiveKitToken } = await import("@/lib/livekit");
    const session = await createLiveKitToken("session_abc123!!unsafe chars");
    expect(session.url).toBe("wss://example.livekit.cloud");
    expect(session.roomName).toMatch(/^au-assistant-/);
    expect(session.identity).toMatch(/^visitor-/);
    // Unsafe characters must be stripped from room/identity names.
    expect(session.roomName).not.toMatch(/[!\s]/);
    // A JWT has three dot-separated base64url segments.
    expect(session.token.split(".")).toHaveLength(3);
    expect(session.token).not.toContain(process.env.LIVEKIT_API_SECRET);
  });

  it("throws a clear error when LiveKit is not configured", async () => {
    delete process.env.LIVEKIT_URL;
    const { createLiveKitToken } = await import("@/lib/livekit");
    await expect(createLiveKitToken("session_xyz")).rejects.toThrow(/not configured/i);
  });
});
