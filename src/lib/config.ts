/**
 * Central configuration. Everything that operators may need to change is read
 * from environment variables (see README) and can be overridden at runtime by
 * an authenticated administrator through the settings table.
 */

export const CAMPUSES = [
  "karachi",
  "islamabad-main",
  "kharian",
  "multan",
  "kamra",
  "bahu",
  "university-wide",
  "unknown",
] as const;

export type Campus = (typeof CAMPUSES)[number];

export const CAMPUS_LABELS: Record<string, string> = {
  karachi: "Karachi Campus",
  "islamabad-main": "Islamabad Main Campus",
  kharian: "Kharian Campus",
  multan: "Multan Campus",
  kamra: "Kamra (A&AC) Campus",
  bahu: "Bahu Campus (Shorkot)",
  "university-wide": "University-wide",
  unknown: "Unscoped",
};

/** Canonical campus directory used by the chat UI, sidebar and comparison mode. */
export const CAMPUS_DIRECTORY: {
  id: Campus;
  label: string;
  city: string;
  officialSite: string;
  established: string;
  note: string;
}[] = [
  {
    id: "islamabad-main",
    label: "Islamabad Main Campus (incl. South Campus H-11)",
    city: "E-9 &  H-11, Islamabad",
    officialSite: "https://www.au.edu.pk/",
    established: "2002",
    note: "Founding campus; widest range of faculties including Engineering, Computing & AI, Management, Social Sciences, Aerospace & Strategic Studies.",
  },
  {
    id: "karachi",
    label: "Karachi Campus",
    city: "PAF Airmen Academy, Korangi Creek, Karachi",
    officialSite: "https://khi.au.edu.pk/",
    established: "2025",
    note: "Newest campus; Computing & AI, Management and Social Sciences at launch, Engineering planned from Fall 2026.",
  },
  {
    id: "kharian",
    label: "Kharian Campus",
    city: "Kharian Cantt, Punjab",
    officialSite: "https://kc.au.edu.pk/",
    established: "established campus (exact year not verified)",
    note: "Computing, Management and Social Sciences programs with its own fee and admission schedule.",
  },
  {
    id: "multan",
    label: "Multan Campus (AUMC)",
    city: "Bahawalpur Road, Multan",
    officialSite: "https://aumc.edu.pk/",
    established: "2011",
    note: "South Punjab campus; Computing & AI, Management, Social Sciences and Basic & Applied Sciences; also offers MS/PhD programs.",
  },
  {
    id: "kamra",
    label: "Aerospace & Aviation Campus (A&AC), Kamra",
    city: "Kamra Kalan, Attock, Punjab",
    officialSite: "https://aack.au.edu.pk/",
    established: "established campus (exact year not verified)",
    note: "Engineering-focused (Aerospace, Avionics, Electrical, Mechanical, Mechatronics) alongside Computing and Management.",
  },
  {
    id: "bahu",
    label: "Bahu Campus, Shorkot Cantt",
    city: "Shorkot Cantt, Punjab",
    officialSite: "https://sk.au.edu.pk/",
    established: "2026 (future projects phase)",
    note: "Newest planned campus serving Faisalabad, Jhang and Sahiwal regions; programs are still being phased in.",
  },
];

export const PAGE_TYPES = [
  "admissions",
  "eligibility",
  "fees",
  "scholarship",
  "programs",
  "how-to-apply",
  "documents",
  "faq",
  "notices",
  "contact",
  "campus-info",
  "about",
  "general",
] as const;

export type PageType = (typeof PAGE_TYPES)[number];

export const DEFAULT_ALLOWED_DOMAINS = [
  "au.edu.pk",
  "www.au.edu.pk",
  "khi.au.edu.pk",
  "khiportals.au.edu.pk",
  "webdata.au.edu.pk",
  "portals.au.edu.pk",
  "admissions.au.edu.pk",
  "admission.au.edu.pk",
  "kc.au.edu.pk",
  "kcportals.au.edu.pk",
  "aumc.edu.pk",
  "aack.au.edu.pk",
  "sk.au.edu.pk",
  "skportals.au.edu.pk",
];

export type CrawlerConfig = {
  startUrl: string;
  allowedDomains: string[];
  maxPages: number;
  maxDepth: number;
  concurrency: number;
  requestDelayMs: number;
  timeoutMs: number;
  maxRetries: number;
  maxDocumentMb: number;
  userAgent: string;
  followPdfs: boolean;
  followImages: boolean;
  respectRobots: boolean;
};

export type RetrievalConfig = {
  topK: number;
  minConfidence: number;
  chunkSize: number;
  chunkOverlap: number;
  embeddingProvider: "hash" | "ollama";
  embeddingModel: string;
  vectorWeight: number;
  keywordWeight: number;
  staleAfterDays: number;
};

export type LlmConfig = {
  provider: "extractive" | "ollama" | "lmstudio" | "hosted" | "google";
  model: string;
  temperature: number;
  maxOutputTokens: number;
  timeoutMs: number;
  maxRetries: number;
  streaming: boolean;
  contextChunks: number;
  ollamaBaseUrl: string;
  lmStudioBaseUrl: string;
  hostedBaseUrl: string;
  googleBaseUrl: string;
};

const num = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const defaultCrawlerConfig: CrawlerConfig = {
  startUrl: process.env.CRAWL_START_URL ?? "https://khi.au.edu.pk/",
  allowedDomains: (process.env.CRAWL_ALLOWED_DOMAINS ?? DEFAULT_ALLOWED_DOMAINS.join(","))
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean),
  maxPages: num(process.env.CRAWL_MAX_PAGES, 40),
  maxDepth: num(process.env.CRAWL_MAX_DEPTH, 3),
  concurrency: Math.min(4, Math.max(1, num(process.env.CRAWL_CONCURRENCY, 2))),
  // Polite by default: 750ms between requests to the same host.
  requestDelayMs: num(process.env.CRAWL_DELAY_MS, 750),
  timeoutMs: num(process.env.CRAWL_TIMEOUT_MS, 15000),
  maxRetries: num(process.env.CRAWL_MAX_RETRIES, 2),
  maxDocumentMb: num(process.env.CRAWL_MAX_DOCUMENT_MB, 15),
  userAgent:
    process.env.CRAWL_USER_AGENT ??
    "AU-KnowledgeBot/1.0 (academic information assistant; contact: knowledge@au.example.edu)",
  followPdfs: (process.env.CRAWL_FOLLOW_PDFS ?? "true") !== "false",
  followImages: (process.env.CRAWL_FOLLOW_IMAGES ?? "false") === "true",
  respectRobots: (process.env.CRAWL_RESPECT_ROBOTS ?? "true") !== "false",
};

export const defaultRetrievalConfig: RetrievalConfig = {
  topK: num(process.env.RETRIEVAL_TOP_K, 8),
  minConfidence: num(process.env.RETRIEVAL_MIN_CONFIDENCE, 0.3),
  chunkSize: num(process.env.RETRIEVAL_CHUNK_SIZE, 1100),
  chunkOverlap: num(process.env.RETRIEVAL_CHUNK_OVERLAP, 180),
  embeddingProvider: process.env.EMBEDDING_PROVIDER === "ollama" ? "ollama" : "hash",
  embeddingModel: process.env.EMBEDDING_MODEL ?? "hash-ngram-384",
  vectorWeight: num(process.env.RETRIEVAL_VECTOR_WEIGHT, 0.45),
  keywordWeight: num(process.env.RETRIEVAL_KEYWORD_WEIGHT, 0.55),
  staleAfterDays: num(process.env.RETRIEVAL_STALE_DAYS, 30),
};

const VALID_LLM_PROVIDERS: LlmConfig["provider"][] = ["extractive", "ollama", "lmstudio", "hosted", "google"];

export const DEFAULT_MODEL_BY_PROVIDER: Record<LlmConfig["provider"], string> = {
  google: "gemini-3.5-flash-lite",
  ollama: "llama3.2:3b",
  lmstudio: "local-model",
  hosted: "gpt-4o-mini",
  extractive: "grounded-extractive-v1",
};

/**
 * Auto-pick the fastest available backend: if an explicit, recognised
 * LLM_PROVIDER is set, honour it; otherwise prefer Google Gemini (online,
 * low-latency) whenever a Google API key is present, falling back to the
 * offline extractive composer so the app still runs with zero external
 * dependencies when no key exists. Pure function so it is unit-testable
 * without relying on module-load-time environment snapshots.
 */
export function resolveDefaultLlmProvider(env: {
  LLM_PROVIDER?: string;
  GOOGLE_API_KEY?: string;
}): LlmConfig["provider"] {
  if (env.LLM_PROVIDER && (VALID_LLM_PROVIDERS as string[]).includes(env.LLM_PROVIDER)) {
    return env.LLM_PROVIDER as LlmConfig["provider"];
  }
  return env.GOOGLE_API_KEY ? "google" : "extractive";
}

const resolvedLlmProvider: LlmConfig["provider"] = resolveDefaultLlmProvider({
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
});

export const defaultLlmConfig: LlmConfig = {
  provider: resolvedLlmProvider,
  model: process.env.LLM_MODEL ?? DEFAULT_MODEL_BY_PROVIDER[resolvedLlmProvider],
  temperature: num(process.env.LLM_TEMPERATURE, 0.2),
  maxOutputTokens: num(process.env.LLM_MAX_OUTPUT_TOKENS, 700),
  // Gemini's hosted API typically answers in a few seconds; keep a generous
  // but non-infinite timeout so a transient outage still falls back fast.
  timeoutMs: num(process.env.LLM_TIMEOUT_MS, resolvedLlmProvider === "google" ? 25000 : 60000),
  maxRetries: num(process.env.LLM_MAX_RETRIES, 1),
  streaming: (process.env.LLM_STREAMING ?? "true") !== "false",
  contextChunks: num(process.env.LLM_CONTEXT_CHUNKS, 6),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
  lmStudioBaseUrl: process.env.LM_STUDIO_BASE_URL ?? "http://127.0.0.1:1234/v1",
  hostedBaseUrl: process.env.HOSTED_LLM_BASE_URL ?? "https://api.openai.com/v1",
  // Google publishes an OpenAI-compatible surface, so the existing
  // OpenAI-style streaming client can talk to Gemini without a new SDK.
  googleBaseUrl: process.env.GOOGLE_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta/openai",
};

export const MIN_CONFIDENCE_FLOOR = 0.12;

export const APP_NAME = "Air University Knowledge Assistant";
export const APP_SCOPE_NOTE =
  "AI-generated explanations, not an official university statement. Official sources are linked with every answer.";

export const SUPPORTED_LANGUAGES = [
  { id: "en", label: "English" },
  { id: "roman-ur", label: "Roman Urdu" },
  { id: "ur", label: "اردو" },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]["id"];
