import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { z } from "zod";

/**
 * Internal API route for waitlist signups from the landing page.
 *
 * This is a thin shim around the `waitlist.join` Convex mutation so that
 * server-side code (or any client without the Convex React provider wired
 * yet) can hit the same endpoint. The React form in TASK-007 will call
 * `useMutation(api.waitlist.join)` directly from the client, but this
 * route exists for:
 *
 *   1. The newsletter form on the landing page footer (TASK-011+)
 *   2. Test runners that don't render React (Playwright raw HTTP)
 *   3. Future server-side email notifications (TASK-069)
 *
 * Method: POST /api/waitlist
 * Body:  { "email": "user@example.com", "source": "footer_cta" }
 * Returns: 200 { ok: true, id: "...", alreadyJoined: bool }
 *          400 { ok: false, error: "Invalid email" }
 */

const Body = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

// Convex client bound to the local dev deployment. Created at module
// scope so it's a singleton, not per-request.
const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210",
);

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

  try {
    const result = await convex.mutation(api.waitlist.join, {
      email: parsed.data.email,
      source: parsed.data.source,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}