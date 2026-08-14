import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * FR-014: Waitlist Capture
 * PRD § 4: `waitlist.join` mutation
 *
 * Validates the email format, dedupes by email (no-op on second insert),
 * and inserts the row with a createdAt timestamp and optional source.
 *
 * Run from the Convex dashboard to test:
 *   npx convex run waitlist.join '{"email":"test@example.com","source":"hero_cta"}'
 * Running it again is a no-op.
 */
export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Minimal email validation — server-side, not for UX.
    // The form-side validation lives in the React component (TASK-007).
    if (!args.email.includes("@") || args.email.length < 3) {
      throw new Error("Invalid email address");
    }

    // Dedupe: if this email is already on the list, return without inserting.
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { id: existing._id, alreadyJoined: true };
    }

    const id = await ctx.db.insert("waitlist", {
      email: args.email,
      source: args.source,
      createdAt: Date.now(),
    });

    return { id, alreadyJoined: false };
  },
});