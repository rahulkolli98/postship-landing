import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { z } from "zod";

/**
 * Internal API route for waitlist signups from the landing page.
 *
 * Production flow (Phase 0+):
 *   1. Browser POSTs { email, source, turnstileToken } to /api/waitlist.
 *   2. This route verifies the Turnstile token against
 *      https://challenges.cloudflare.com/turnstile/v0/siteverify using the
 *      secret key stored in the `TURNSTILE_SECRET_KEY` runtime env var.
 *   3. On success, calls the Convex `waitlist.join` mutation.
 *   4. Returns the mutation result, or a generic error string on failure
 *      (we never leak Convex internals or Turnstile failure modes to the
 *      caller — see H3 in the security review).
 *
 * Dev / test bypass:
 *   - In dev (`TURNSTILE_DEV_BYPASS=true`), the verification step is skipped.
 *   - This is set in .env.local for `npm run dev` and in playwright.config.ts
 *     for tests. Production NEVER has this flag, so the bypass is impossible.
 *
 * Method: POST /api/waitlist
 * Body:  { "email": "user@example.com", "source": "footer_waitlist", "turnstileToken": "..." }
 * Returns:
 *   200 { ok: true, id: "...", alreadyJoined: bool }
 *   400 { ok: false, error: "Invalid email" }
 *   403 { ok: false, error: "Bot challenge failed" }  (Turnstile failed)
 *   500 { ok: false, error: "Couldn't add you to the list — try again." }
 */

const Body = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
  turnstileToken: z.string().min(1).max(2048),
});

// Convex client bound to the local dev deployment. Created at module
// scope so it's a singleton, not per-request.
const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210",
);

type TurnstileVerifyResult =
  | { success: true }
  | { success: false; reason: string };

/**
 * Verify a Turnstile token server-side. In dev (bypass flag set) this
 * always succeeds. In production it posts to Cloudflare's siteverify
 * endpoint and returns the verdict.
 */
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<TurnstileVerifyResult> {
  if (process.env.TURNSTILE_DEV_BYPASS === "true") {
    return { success: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail closed: production has no business accepting waitlist signups
    // when the bot-protection secret is missing. Halt rather than let bots
    // bypass the check entirely.
    return {
      success: false,
      reason: "server_misconfigured",
    };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
    if (!res.ok) {
      return { success: false, reason: "upstream_error" };
    }
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return { success: false, reason: data["error-codes"]?.join(",") ?? "rejected" };
    }
    return { success: true };
  } catch {
    return { success: false, reason: "network_error" };
  }
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 },
    );
  }

  // ─── Turnstile verification ───────────────────────────────────────────
  const remoteIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  const verify = await verifyTurnstile(parsed.data.turnstileToken, remoteIp);
  if (!verify.success) {
    return NextResponse.json(
      { ok: false, error: "Bot challenge failed" },
      { status: 403 },
    );
  }

  // ─── Convex mutation ──────────────────────────────────────────────────
  try {
    const result = await convex.mutation(api.waitlist.join, {
      email: parsed.data.email,
      source: parsed.data.source,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch {
    // Generic message — never leak Convex internals. The real error is
    // visible in the Cloudflare dashboard's Workers logs.
    return NextResponse.json(
      { ok: false, error: "Couldn't add you to the list — try again." },
      { status: 500 },
    );
  }
}