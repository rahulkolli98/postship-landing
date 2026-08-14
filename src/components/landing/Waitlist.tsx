"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";

/**
 * FR-014: Waitlist Capture component.
 *
 * PRD § 8 screen: footer (or inline) email field + submit button.
 * Uses Convex `useMutation` to call `waitlist.join` directly from the client.
 * No intermediary API route — this is the production path.
 *
 * Validates email client-side via a basic regex before submitting (server
 * also validates in the mutation). Shows three states:
 *   - idle: email input + "Join the waitlist" button
 *   - submitting: button disabled with spinner
 *   - success: "You're on the list" message, input replaced
 *   - error: error message under input (mutation rejected, network down, etc.)
 *
 * Email is deduplicated server-side via the `by_email` index in schema.ts.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [source] = useState("footer_waitlist");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const join = useMutation(api.waitlist.join);

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
      const result = await join({ email, source });
      setStatus("success");
      setMessage(
        result.alreadyJoined
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll email you when Postship ships.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
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
      className="flex w-full max-w-md flex-col gap-2"
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
          disabled={status === "submitting" || email.length === 0}
          data-testid="waitlist-submit"
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist"}
        </Button>
      </div>
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