import { getStripe } from '@/lib/stripe/server';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { depositAmount, bookingDetails } = body as {
      depositAmount: number;
      bookingDetails: {
        packageId: string;
        eventDate: string;
        customerEmail: string;
      };
    };

    // Deposit is always $100 (10000 cents) — reject anything else
    if (depositAmount !== 10000) {
      return Response.json(
        { error: 'Deposit amount must be $100 (10000 cents).' },
        { status: 400 }
      );
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: 10000,
      currency: 'cad',
      metadata: {
        package:        bookingDetails.packageId  ?? '',
        event_date:     bookingDetails.eventDate   ?? '',
        customer_email: bookingDetails.customerEmail ?? '',
      },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error creating payment intent.';
    return Response.json({ error: message }, { status: 500 });
  }
}
