import type { LlmConfig } from "@/lib/config";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ProviderInfo = { id: string; label: string; isLocal: boolean; model: string };

export function providerInfo(config: LlmConfig): ProviderInfo {
  switch (config.provider) {
    case "ollama":
      return { id: "ollama", label: "Ollama (local inference)", isLocal: true, model: config.model };
    case "lmstudio":
      return { id: "lmstudio", label: "LM Studio local OpenAI-compatible server", isLocal: true, model: config.model };
    case "google":
      return {
        id: "google",
        label: "Google Gemini (online, low-latency)",
        isLocal: false,
        model: config.model,
      };
    case "hosted":
      return {
        id: "hosted",
        label: "Authorized hosted provider (OpenAI-compatible)",
        isLocal: false,
        model: config.model,
      };
    default:
      return {
        id: "extractive",
        label: "Grounded extractive composer (offline, no paid API)",
        isLocal: true,
        model: "grounded-extractive-v1",
      };
  }
}

async function* readLines(response: Response): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) yield line;
  }
  if (buffer) yield buffer;
}

async function* streamOllama(messages: ChatMessage[], config: LlmConfig): AsyncGenerator<string> {
  const response = await fetch(`${config.ollamaBaseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: config.model, messages, stream: true, options: { temperature: config.temperature, num_predict: config.maxOutputTokens } }),
    signal: AbortSignal.timeout(config.timeoutMs),
  });
  if (!response.ok) throw new Error(`Ollama returned HTTP ${response.status}`);
  for await (const line of readLines(response)) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line) as { message?: { content?: string }; done?: boolean };
      if (data.message?.content) yield data.message.content;
      if (data.done) break;
    } catch {
      continue;
    }
  }
}

async function* streamOpenAiCompatible(
  messages: ChatMessage[],
  config: LlmConfig,
  baseUrl: string,
  apiKey: string | undefined,
  extraBody: Record<string, unknown> = {},
): AsyncGenerator<string> {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxOutputTokens,
      stream: true,
      ...extraBody,
    }),
    signal: AbortSignal.timeout(config.timeoutMs),
  });
  if (!response.ok) {
    let detail = "";
    try {
      detail = (await response.text()).replace(/\s+/g, " ").slice(0, 200);
    } catch {
      /* body unreadable */
    }
    throw new Error(`Inference server returned HTTP ${response.status}${detail ? ` — ${detail}` : ""}`);
  }
  for await (const line of readLines(response)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (payload === "[DONE]") break;
    try {
      const data = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
      const token = data.choices?.[0]?.delta?.content;
      if (token) yield token;
    } catch {
      continue;
    }
  }
}

/**
 * Google retires Gemini model names regularly (for example gemini-2.5-flash
 * now answers 404 "no longer available to new users"). Rather than breaking
 * the chatbot every time that happens, try the configured model first and
 * then these currently-working fallbacks — "-latest" aliases track Google's
 * newest stable model automatically. Only retried when NOTHING was streamed yet,
 * so a user never sees two answers glued together.
 */
const GOOGLE_MODEL_FALLBACKS = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-flash-latest"];

async function* streamGoogle(messages: ChatMessage[], config: LlmConfig, apiKey: string): AsyncGenerator<string> {
  const candidates = [...new Set([config.model, ...GOOGLE_MODEL_FALLBACKS])].slice(0, 3);
  let lastError: unknown = null;
  for (let index = 0; index < candidates.length; index += 1) {
    const model = candidates[index];
    let emitted = false;
    try {
      const attemptConfig: LlmConfig = {
        ...config,
        model,
        // Fallback attempts get a tighter budget so the user is never stuck waiting.
        timeoutMs: index === 0 ? config.timeoutMs : Math.min(config.timeoutMs, 15000),
        // Gemini "thinking" tokens count against max_tokens; keep reasoning light so
        // answers are fast and never truncated by hidden reasoning.
        maxOutputTokens: Math.max(config.maxOutputTokens, 1200),
      };
      for await (const token of streamOpenAiCompatible(messages, attemptConfig, config.googleBaseUrl, apiKey, {
        reasoning_effort: "low",
      })) {
        emitted = true;
        yield token;
      }
      return;
    } catch (error) {
      lastError = error;
      if (emitted) throw error; // never splice two different answers together
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Google Gemini request failed");
}

export async function* streamFromProvider(messages: ChatMessage[], config: LlmConfig): AsyncGenerator<string> {
  if (config.provider === "ollama") {
    yield* streamOllama(messages, config);
    return;
  }
  if (config.provider === "lmstudio") {
    yield* streamOpenAiCompatible(messages, config, config.lmStudioBaseUrl, process.env.LM_STUDIO_API_KEY);
    return;
  }
  if (config.provider === "google") {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Google provider selected but GOOGLE_API_KEY is not configured");
    // Google exposes an OpenAI-compatible chat/completions surface for Gemini,
    // so the same tested SSE streaming client used for other providers works
    // here without needing a separate SDK.
    yield* streamGoogle(messages, config, apiKey);
    return;
  }
  if (config.provider === "hosted") {
    const apiKey = process.env.HOSTED_LLM_API_KEY ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Hosted provider selected but HOSTED_LLM_API_KEY is not configured");
    yield* streamOpenAiCompatible(messages, config, config.hostedBaseUrl, apiKey);
    return;
  }
  throw new Error("No remote provider configured; the extractive composer is used instead");
}

export async function completeFromProvider(messages: ChatMessage[], config: LlmConfig): Promise<string> {
  let output = "";
  for await (const token of streamFromProvider(messages, config)) output += token;
  return output.trim();
}
