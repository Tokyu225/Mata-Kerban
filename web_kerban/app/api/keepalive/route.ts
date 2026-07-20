import { NextResponse } from "next/server";

/**
 * Vercel Cron Job — pings Supabase every 5 minutes to prevent
 * free-tier pausing due to inactivity.
 *
 * Configured in vercel.json → crons
 */

const PROJECT_REF = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

async function ping(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        apikey: ANON_KEY,
        Authorization: ANON_KEY ? `Bearer ${ANON_KEY}` : "",
      },
    });
    return `OK (${res.status})`;
  } catch (e: unknown) {
    return `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  if (!PROJECT_REF) {
    console.warn("[keepalive] No Supabase URL configured — skipping.");
    return NextResponse.json({ status: "skipped", reason: "No Supabase URL configured" }, { status: 200 });
  }

  const base = PROJECT_REF.replace(/\/$/, "");

  const [rest, storage, auth] = await Promise.all([
    ping(`${base}/rest/v1/`),
    ping(`${base}/storage/v1/bucket`),
    ping(`${base}/auth/v1/health`),
  ]);

  const result = { rest, storage, auth, time: new Date().toISOString() };
  console.log("[keepalive]", JSON.stringify(result));

  return NextResponse.json({ status: "ok", ...result });
}
