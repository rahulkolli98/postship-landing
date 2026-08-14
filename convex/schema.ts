import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema — landing app.
 *
 * This is the minimum schema needed for Phase 0 (TASK-003 + TASK-006 +
 * TASK-014). The landing page only needs `waitlist` — the rest of the
 * tables (users, accounts, posts) live in the future `webapp/` subfolder.
 *
 * The full PRD § 3 schema:
 *   users, accounts, posts, waitlist
 *
 * Per the PRD Repo Structure (updated 2026-07-31), the landing subfolder
 * is intentionally lean. When webapp/ is created in Phase 1, copy
 * the waitlist table from here to webapp/convex/schema.ts (or move
 * the whole convex/ directory up to repo root and split the schema).
 *
 * Note: `npx convex dev` requires this file to typecheck before syncing.
 * If `npx convex dev` complains about the import shape, run
 * `npx convex codegen` to refresh `convex/_generated/`.
 */
export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    source: v.optional(v.string()), // "hero_cta" | "footer_cta" | "pricing_cta" etc.
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),
});