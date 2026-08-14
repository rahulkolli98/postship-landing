import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext Cloudflare adapter config.
 *
 * Loaded by `opennextjs-cloudflare build` (invoked via `npm run build`)
 * to translate `next build`'s standalone output into a Workers-compatible
 * `.open-next/` directory.
 *
 * Defaults are sufficient for Phase 0 (landing page). Add overrides here
 * when:
 *  - Phase 1 needs R2 incremental cache (TASK-004 v2)
 *  - Phase 2 needs queue revalidation
 *  - Phase 3 needs image loader overrides
 *
 * Per docs: to type the `env` parameter in route handlers with Cloudflare
 * bindings, run `npm run cf-typegen` to generate `cloudflare-env.d.ts`.
 */
export default defineCloudflareConfig({});