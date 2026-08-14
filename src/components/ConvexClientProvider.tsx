"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { type ReactNode } from "react";

/**
 * Convex client provider — wraps the app in ConvexProvider so any
 * `useQuery` / `useMutation` hooks in child components can hit the
 * Convex deployment. The deployment URL is set by `npx convex dev`
 * into `.env.local` as `NEXT_PUBLIC_CONVEX_URL`.
 *
 * Pattern: per the PRD Repo Structure note, each app subfolder owns
 * its own Convex project. The landing app's Convex project only has
 * the `waitlist` table — the full schema lives in the future
 * `webapp/convex/`.
 *
 * Singleton client: created once at module load. In dev, this re-runs
 * on hot reload; in prod, it's stable for the server lifetime.
 */
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210",
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}