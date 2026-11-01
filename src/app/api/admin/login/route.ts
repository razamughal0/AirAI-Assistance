import { z } from "zod";
import { checkPassword, rateLimit, setAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const key = `admin-login:${forwarded.split(",")[0].trim()}`;
  const limit = rateLimit(key, 8, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Password is required" }, { status: 422 });
  if (!checkPassword(parsed.data.password)) {
    return Response.json({ error: "Incorrect administrator password" }, { status: 401 });
  }
  await setAdminSession();
  return Response.json({ ok: true });
}
