"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: FormData) {
    const errs: Record<string, string> = {};
    const name    = (data.get("name")    as string).trim();
    const email   = (data.get("email")   as string).trim();
    const message = (data.get("message") as string).trim();

    if (!name)    errs.name    = "Almost there — name needs a second look.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                  errs.email   = "Almost there — email needs a second look.";
    if (!message) errs.message = "Almost there — message needs a second look.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs = validate(data);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setState("submitting");

    // TODO Phase 4: POST to /api/contact (Resend)
    await new Promise((r) => setTimeout(r, 900));
    setState("success");
  }

  if (state === "success") {
    return (
      <div className="py-[40px]">
        <p className="text-[clamp(20px,2vw,26px)] font-medium text-ink-soft tracking-[-0.02em] mb-[12px]">
          Message sent.
        </p>
        <p className="text-[14px] text-warm-gray-soft leading-[1.55]">
          We reply within 4 hours. Check your inbox — and spam, just in case.
        </p>
      </div>
    );
  }

  const fieldBase = [
    "w-full rounded-[4px] bg-bone px-[16px] py-[14px]",
    "text-[14px] text-ink-soft placeholder:text-warm-gray",
    "[border:0.5px_solid_var(--color-border-light)]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
    "transition-colors duration-150",
  ].join(" ");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[16px]">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-[11px] font-medium tracking-[0.12em] uppercase text-warm-gray mb-[6px]">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Chen"
          className={fieldBase}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="name-error" className="mt-[6px] text-[12px] text-clay">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-[11px] font-medium tracking-[0.12em] uppercase text-warm-gray mb-[6px]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          className={fieldBase}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" className="mt-[6px] text-[12px] text-clay">{errors.email}</p>
        )}
      </div>

      {/* Event date (optional) */}
      <div>
        <label htmlFor="eventDate" className="block text-[11px] font-medium tracking-[0.12em] uppercase text-warm-gray mb-[6px]">
          Event date <span className="normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          className={fieldBase}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-[11px] font-medium tracking-[0.12em] uppercase text-warm-gray mb-[6px]">
          What&rsquo;s on your mind?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us about the event — date, venue, guest count, anything specific you need."
          className={[fieldBase, "resize-none leading-[1.55]"].join(" ")}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p id="message-error" className="mt-[6px] text-[12px] text-clay">{errors.message}</p>
        )}
      </div>

      <div className="pt-[8px]">
        <Button
          type="submit"
          variant="primary"
          disabled={state === "submitting"}
          className="w-full sm:w-auto justify-center"
        >
          {state === "submitting" ? "Sending…" : "Send message →"}
        </Button>
      </div>
    </form>
  );
}
