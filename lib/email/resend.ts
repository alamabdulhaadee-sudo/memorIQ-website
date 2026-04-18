import { Resend } from 'resend';

// Initialize once at module load — safe to call from any server-side context.
// RESEND_API_KEY must be set in .env.local (never NEXT_PUBLIC_).

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  // Warn at startup rather than crashing — send() will fail gracefully.
  console.warn('[resend] RESEND_API_KEY is not set. Emails will not be sent.');
}

export const resend = new Resend(apiKey ?? 'MISSING_KEY');

// ---------------------------------------------------------------------------
// Typed send wrapper
// ---------------------------------------------------------------------------

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from:     opts.from,
      to:       Array.isArray(opts.to) ? opts.to : [opts.to],
      replyTo:  opts.replyTo,
      subject:  opts.subject,
      html:     opts.html,
    });

    if (error) {
      console.error('[resend] send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[resend] unexpected error:', message);
    return { success: false, error: message };
  }
}
