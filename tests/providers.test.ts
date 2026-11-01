import { describe, expect, it } from "vitest";
import { providerInfo } from "@/lib/llm/providers";
import { resolveDefaultLlmProvider } from "@/lib/config";
import type { LlmConfig } from "@/lib/config";

const baseConfig: LlmConfig = {
  provider: "extractive",
  model: "grounded-extractive-v1",
  temperature: 0.2,
  maxOutputTokens: 700,
  timeoutMs: 30000,
  maxRetries: 1,
  streaming: true,
  contextChunks: 6,
  ollamaBaseUrl: "http://127.0.0.1:11434",
  lmStudioBaseUrl: "http://127.0.0.1:1234/v1",
  hostedBaseUrl: "https://api.openai.com/v1",
  googleBaseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
};

describe("provider info", () => {
  it("reports Google Gemini as a non-local, online provider", () => {
    const info = providerInfo({ ...baseConfig, provider: "google", model: "gemini-3.5-flash-lite" });
    expect(info.id).toBe("google");
    expect(info.isLocal).toBe(false);
    expect(info.model).toBe("gemini-3.5-flash-lite");
    expect(info.label).toMatch(/Gemini/i);
  });

  it("still reports the offline extractive composer as local with no model dependency", () => {
    const info = providerInfo(baseConfig);
    expect(info.id).toBe("extractive");
    expect(info.isLocal).toBe(true);
  });

  it("reports Ollama and LM Studio as local providers", () => {
    expect(providerInfo({ ...baseConfig, provider: "ollama" }).isLocal).toBe(true);
    expect(providerInfo({ ...baseConfig, provider: "lmstudio" }).isLocal).toBe(true);
  });
});

describe("default provider resolution (fast online API when available)", () => {
  it("prefers Google Gemini when a key is present and no explicit provider is set", () => {
    expect(resolveDefaultLlmProvider({ GOOGLE_API_KEY: "test-key" })).toBe("google");
  });

  it("falls back to the offline extractive composer when no key and no override exist", () => {
    expect(resolveDefaultLlmProvider({})).toBe("extractive");
  });

  it("an explicit, recognised LLM_PROVIDER always wins over the Google auto-default", () => {
    expect(resolveDefaultLlmProvider({ LLM_PROVIDER: "ollama", GOOGLE_API_KEY: "test-key" })).toBe("ollama");
  });

  it("ignores an unrecognised LLM_PROVIDER value instead of crashing", () => {
    expect(resolveDefaultLlmProvider({ LLM_PROVIDER: "not-a-real-provider", GOOGLE_API_KEY: "test-key" })).toBe("google");
    expect(resolveDefaultLlmProvider({ LLM_PROVIDER: "not-a-real-provider" })).toBe("extractive");
  });
});
