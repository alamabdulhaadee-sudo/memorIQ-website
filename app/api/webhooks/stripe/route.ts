import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { getSupabase } from '@/lib/supabase/server';

// Opt out of static caching — this route must always run dynamically
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  const body = await request.text(); // raw body required for signature verification
  const sig = request.headers.get('stripe-signature');

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

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (getSupabase().from('bookings') as any)
          .insert({
            stripe_payment_intent_id: intent.id,
            event_date:     meta.event_date     ?? null,
            package_id:     meta.package_id     ?? null,
            customer_name:  meta.customer_name  ?? null,
            customer_email: meta.customer_email ?? null,
            customer_phone: meta.customer_phone ?? null,
            event_type:     meta.event_type     ?? null,
            venue_name:     meta.venue_name     ?? null,
            venue_address:  meta.venue_address  ?? null,
            guest_count:    meta.guest_count    ? Number(meta.guest_count) : null,
            notes:          meta.notes          ?? null,
            template_choice: meta.template_choice ?? null,
            backdrop_choice: meta.backdrop_choice ?? null,
            selected_add_ons: meta.add_ons
              ? JSON.parse(meta.add_ons)
              : [],
            subtotal:        meta.subtotal       ? Number(meta.subtotal)      : null,
            deposit_amount:  intent.amount,
            status:          'confirmed',
            deposit_paid:    true,
          });

        if (error) {
          console.error('[stripe webhook] supabase insert failed:', error.message);
        } else {
          console.log('[stripe webhook] booking created for intent:', intent.id);
        }
      } catch (err) {
        // Log and continue — do not return non-200 or Stripe will retry
        console.error('[stripe webhook] unexpected error writing booking:', err);
      }

      break;
    }
    default:
      // Unhandled event types — safe to ignore
      break;
  }

  return Response.json({ received: true });
}
