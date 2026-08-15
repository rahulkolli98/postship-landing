"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * FR-014: Waitlist Capture component.
 *
 * Submits through `POST /api/waitlist`, which verifies a Cloudflare Turnstile
 * challenge server-side before calling the Convex `waitlist.join` mutation.
 *
 * Flow:
 *   1. Turnstile widget renders when the component mounts and emits a token.
 *   2. User enters email + clicks "Join the waitlist".
 *   3. Browser POSTs { email, source, turnstileToken } to /api/waitlist.
 *   4. Server verifies token → calls Convex → returns the row id.
 *
 * States: idle | submitting | success | error.
 *
 * The Turnstile widget is loaded from
 * `https://challenges.cloudflare.com/turnstile/v0/api.js` (Cloudflare's
 * CDN). The script is loaded once per page and reused across renders via
 * a singleton guard.
 *
 * In dev / Playwright (TURNSTILE_DEV_BYPASS=true), the widget still renders
 * but the server skips verification, so local flows keep working without
 * provisioning a Turnstile site key.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

type Status = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let turnstileScriptPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Turnstile script failed")));
    document.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  // Turnstile widget plumbing
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  useEffect(() => {
    // Skip widget rendering if no site key is configured (e.g. local dev
    // before keys are set up). The server's bypass flag handles the rest.
    if (!siteKey) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile || !turnstileContainerRef.current) return;
        const id = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: siteKey,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
        widgetIdRef.current = id;
      })
      .catch(() => {
        // Widget failed to load — submit will surface a clearer error.
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore — widget already torn down
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "footer_waitlist",
          turnstileToken: turnstileToken || "dev-bypass",
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        id?: string;
        alreadyJoined?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(
          data.error ??
            "Something went sideways on our end. Give it another shot.",
        );
        // Reset the widget so the user can retry without a stale token.
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
            setTurnstileToken("");
          } catch {
            // ignore
          }
        }
        return;
      }
      setStatus("success");
      setMessage(
        data.alreadyJoined
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll email you when Postship ships.",
      );
    } catch {
      setStatus("error");
      setMessage("Network glitch on our side. Try once more in a sec?");
    }
  }

  if (status === "success") {
    return (
      <div
        data-testid="waitlist-success"
        className="flex items-center gap-2 text-sm text-zinc-700"
      >
        <span className="inline-block size-2 rounded-full bg-emerald-500" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3"
      noValidate
    >
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@yourdomain.com"
          aria-label="Email address"
          data-testid="waitlist-email"
          disabled={status === "submitting"}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={
            status === "submitting" ||
            email.length === 0 ||
            (Boolean(siteKey) && turnstileToken.length === 0)
          }
          data-testid="waitlist-submit"
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist"}
        </Button>
      </div>
      {siteKey ? (
        <div
          ref={turnstileContainerRef}
          data-testid="turnstile-widget"
          className="min-h-[65px]"
        />
      ) : null}
      {status === "error" && message ? (
        <p
          data-testid="waitlist-error"
          className="text-sm text-red-600"
          role="alert"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}