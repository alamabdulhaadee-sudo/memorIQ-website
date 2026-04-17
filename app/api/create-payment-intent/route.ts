import { getStripe } from '@/lib/stripe/server';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { depositAmount, bookingDetails } = body as {
      depositAmount: number;
      bookingDetails: {
        packageId:      string;
        eventDate:      string | null;
        customerName:   string;
        customerEmail:  string;
        customerPhone:  string;
        eventType:      string | null;
        venueName:      string;
        venueAddress:   string;
        guestCount:     number | null;
        notes:          string;
        templateChoice: string | null;
        backdropChoice: string | null;
        selectedAddOns: unknown[];
        subtotal:       number;
      };
    };

    // Deposit is always $100 (10000 cents) — reject anything else
    if (depositAmount !== 10000) {
      return Response.json(
        { error: 'Deposit amount must be $100 (10000 cents).' },
        { status: 400 }
      );
    }

    const notes = (bookingDetails.notes ?? '').slice(0, 500);

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: 10000,
      currency: 'cad',
      metadata: {
        package_id:      bookingDetails.packageId      ?? '',
        event_date:      bookingDetails.eventDate       ?? '',
        customer_name:   bookingDetails.customerName    ?? '',
        customer_email:  bookingDetails.customerEmail   ?? '',
        customer_phone:  bookingDetails.customerPhone   ?? '',
        event_type:      bookingDetails.eventType       ?? '',
        venue_name:      bookingDetails.venueName       ?? '',
        venue_address:   bookingDetails.venueAddress    ?? '',
        guest_count:     bookingDetails.guestCount != null ? String(bookingDetails.guestCount) : '',
        notes,
        template_choice: bookingDetails.templateChoice  ?? '',
        backdrop_choice: bookingDetails.backdropChoice  ?? '',
        add_ons:         JSON.stringify(bookingDetails.selectedAddOns ?? []),
        subtotal:        String(bookingDetails.subtotal ?? 0),
        deposit_amount:  '10000',
      },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error creating payment intent.';
    return Response.json({ error: message }, { status: 500 });
  }
}
