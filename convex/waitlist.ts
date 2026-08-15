import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * FR-014: Waitlist Capture
 * PRD § 4: `waitlist.join` mutation
 *
 * Validates the email format (length-capped per RFC 5321 + simple shape
 * check), normalizes the address (trim + lowercase) so dedupe is reliable
 * across case variants, dedupes by email (no-op on second insert), and
 * inserts the row with a createdAt timestamp and optional source.
 *
 * This is the authoritative server-side validator — the /api/waitlist route
 * uses the same shape but rejects slightly earlier with a 400 (Zod). Defense
 * in depth: the mutation should refuse garbage even if the route is bypassed.
 *
 * Run from the Convex dashboard to test:
 *   npx convex run waitlist.join '{"email":"test@example.com","source":"hero_cta"}'
 * Running it again is a no-op.
 */

// RFC 5321 caps the local + domain parts at 254 octets total.
const EMAIL_MAX_LENGTH = 254;

// Matches the regex used by the React form and the /api/waitlist Zod schema.
// Not a full RFC 5322 parser — that's overkill for a waitlist; this rejects
// obviously malformed input (no `@`, no domain dot, embedded whitespace).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOURCE_MAX_LENGTH = 64;

export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const source = args.source?.trim();

    if (
      email.length === 0 ||
      email.length > EMAIL_MAX_LENGTH ||
      !EMAIL_RE.test(email)
    ) {
      throw new Error("Invalid email address");
    }

    if (source !== undefined && source.length > SOURCE_MAX_LENGTH) {
      throw new Error("Source too long");
    }

    // Dedupe: if this email is already on the list, return without inserting.
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { id: existing._id, alreadyJoined: true };
    }

    const id = await ctx.db.insert("waitlist", {
      email,
      source,
      createdAt: Date.now(),
    });

    return { id, alreadyJoined: false };
  },
});