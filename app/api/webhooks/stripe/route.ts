import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';

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
      // TODO (Prompt 8): write booking record to Supabase
      console.log('[stripe webhook] payment_intent.succeeded:', event.data.object);
      break;
    }
    default:
      // Unhandled event types — safe to ignore
      break;
  }

  return Response.json({ received: true });
}
