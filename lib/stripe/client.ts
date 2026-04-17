import { loadStripe } from '@stripe/stripe-js';

// Initialised once outside any component to avoid re-creating the Stripe object
// on every render. loadStripe returns a Promise<Stripe | null>.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
