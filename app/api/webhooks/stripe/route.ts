import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { getSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import {
  bookingConfirmationSubject,
  bookingConfirmationHtml,
  type BookingConfirmationData,
} from '@/lib/email/templates/booking-confirmation';
import {
  bookingNotificationSubject,
  bookingNotificationHtml,
  INTERNAL_NOTIFY_TO,
  type BookingNotificationData,
} from '@/lib/email/templates/booking-notification';
import { PACKAGES } from '@/lib/data/packages';

// Opt out of static caching — this route must always run dynamically
export const dynamic = 'force-dynamic';

// ── Package lookup helpers ────────────────────────────────────────────────────

import type { PackageId } from '@/types/booking';

const PACKAGE_MAP = new Map(PACKAGES.map((p) => [p.id, p]));

function packageLabel(id: string): string {
  return PACKAGE_MAP.get(id as PackageId)?.label ?? id;
}

function packageMeta(id: string): string {
  return PACKAGE_MAP.get(id as PackageId)?.meta ?? '';
}

// ── Webhook handler ───────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const body = await request.text(); // raw body required for signature verification
  const sig  = request.headers.get('stripe-signature');

  if (!sig) {
    return Response.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed.';
    console.error('[stripe webhook] signature verification failed:', message);
    return Response.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      const meta   = intent.metadata ?? {};

      // ── 1. Write booking to Supabase ────────────────────────────────────────
      let bookingWriteOk = false;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (getSupabase().from('bookings') as any)
          .insert({
            stripe_payment_intent_id: intent.id,
            event_date:      meta.event_date     ?? null,
            package_id:      meta.package_id     ?? null,
            customer_name:   meta.customer_name  ?? null,
            customer_email:  meta.customer_email ?? null,
            customer_phone:  meta.customer_phone ?? null,
            event_type:      meta.event_type     ?? null,
            venue_name:      meta.venue_name     ?? null,
            venue_address:   meta.venue_address  ?? null,
            guest_count:     meta.guest_count    ? Number(meta.guest_count) : null,
            notes:           meta.notes          ?? null,
            template_choice: meta.template_choice ?? null,
            backdrop_choice: meta.backdrop_choice ?? null,
            add_ons:         meta.add_ons ? JSON.parse(meta.add_ons) : [],
            subtotal:        meta.subtotal        ? Number(meta.subtotal)   : null,
            deposit_amount:  intent.amount,
            status:          'confirmed',
            deposit_paid:    true,
          });

        if (error) {
          console.error('[stripe webhook] supabase insert failed:', error.message);
        } else {
          console.log('[stripe webhook] booking created for intent:', intent.id);
          bookingWriteOk = true;
        }
      } catch (err) {
        // Log and continue — do not return non-200 or Stripe will retry
        console.error('[stripe webhook] unexpected error writing booking:', err);
      }

      // ── 2. Send emails (fire-and-forget; never fail the webhook) ─────────────

      if (bookingWriteOk && meta.customer_email && meta.event_date && meta.package_id) {
        const addOnIds: string[] = meta.add_ons ? JSON.parse(meta.add_ons) : [];
        // Humanise add-on IDs by replacing underscores and capitalising
        const addOnNames = addOnIds.map((id) =>
          id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        );

        const subtotalCents  = meta.subtotal ? Number(meta.subtotal) : 0;
        const depositCents   = intent.amount;
        const balanceCents   = Math.max(0, subtotalCents - depositCents);

        // Confirmation to customer
        const confirmData: BookingConfirmationData = {
          customerName:    meta.customer_name  ?? 'Valued customer',
          customerEmail:   meta.customer_email,
          eventDate:       meta.event_date,
          packageLabel:    packageLabel(meta.package_id),
          packageMeta:     packageMeta(meta.package_id),
          venueName:       meta.venue_name    || undefined,
          venueAddress:    meta.venue_address || undefined,
          subtotalCents,
          depositCents,
          balanceDueCents: balanceCents,
          addOns:          addOnNames,
        };

        sendEmail({
          from:    'MEMORIQ <bookings@memoriq.co>',
          to:      meta.customer_email,
          subject: bookingConfirmationSubject(meta.event_date),
          html:    bookingConfirmationHtml(confirmData),
        }).then((result) => {
          if (!result.success) {
            console.error('[stripe webhook] confirmation email failed:', result.error);
          } else {
            console.log('[stripe webhook] confirmation email sent:', result.id);
          }
        });

        // Internal notification to MEMORIQ team
        const notifyData: BookingNotificationData = {
          customerName:    meta.customer_name  ?? '—',
          customerEmail:   meta.customer_email,
          customerPhone:   meta.customer_phone || undefined,
          eventDate:       meta.event_date,
          packageId:       meta.package_id,
          packageLabel:    packageLabel(meta.package_id),
          venueName:       meta.venue_name     || undefined,
          venueAddress:    meta.venue_address  || undefined,
          eventType:       meta.event_type     || undefined,
          guestCount:      meta.guest_count    ? Number(meta.guest_count) : undefined,
          notes:           meta.notes          || undefined,
          templateChoice:  meta.template_choice || undefined,
          backdropChoice:  meta.backdrop_choice || undefined,
          addOns:          addOnNames,
          subtotalCents,
          depositCents,
          stripeIntentId:  intent.id,
        };

        sendEmail({
          from:    'MEMORIQ System <system@memoriq.co>',
          to:      INTERNAL_NOTIFY_TO,
          subject: bookingNotificationSubject(notifyData),
          html:    bookingNotificationHtml(notifyData),
        }).then((result) => {
          if (!result.success) {
            console.error('[stripe webhook] notification email failed:', result.error);
          } else {
            console.log('[stripe webhook] notification email sent:', result.id);
          }
        });
      }

      break;
    }
    default:
      // Unhandled event types — safe to ignore
      break;
  }

  return Response.json({ received: true });
}
