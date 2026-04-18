// Internal booking notification email — sent to the MEMORIQ team on every
// confirmed booking. Contains the full booking details for ops follow-up.

export const INTERNAL_NOTIFY_TO = 'hello@memoriq.co'; // TODO: make env-configurable

export interface BookingNotificationData {
  customerName:    string;
  customerEmail:   string;
  customerPhone?:  string;
  eventDate:       string;   // ISO "YYYY-MM-DD"
  packageId:       string;
  packageLabel:    string;
  venueName?:      string;
  venueAddress?:   string;
  eventType?:      string;
  guestCount?:     number;
  notes?:          string;
  templateChoice?: string;
  backdropChoice?: string;
  addOns:          string[]; // human-readable add-on names
  subtotalCents:   number;
  depositCents:    number;
  stripeIntentId:  string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })}`;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

// ── Subject ───────────────────────────────────────────────────────────────────

export function bookingNotificationSubject(data: BookingNotificationData): string {
  return `New booking: ${data.customerName} — ${formatDate(data.eventDate)} — ${data.packageLabel}`;
}

// ── HTML body ─────────────────────────────────────────────────────────────────

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 16px;font-size:13px;font-weight:500;color:#999490;white-space:nowrap;width:160px;vertical-align:top;">
      ${label}
    </td>
    <td style="padding:8px 16px;font-size:13px;color:#1a1613;border-left:1px solid #f0ece4;">
      ${value}
    </td>
  </tr>`;
}

export function bookingNotificationHtml(data: BookingNotificationData): string {
  const addOnsList = data.addOns.length > 0 ? data.addOns.join(', ') : 'None';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New MEMORIQ Booking</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1613;padding:24px 32px;">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,241,234,0.4);">
                MEMORIQ System Notification
              </p>
              <h1 style="margin:0;font-size:22px;font-weight:500;color:#f4f1ea;letter-spacing:-0.02em;">
                New booking confirmed
              </h1>
            </td>
          </tr>

          <!-- Customer -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 8px 0;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#999490;">
                Customer
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0ece4;border-radius:4px;overflow:hidden;">
                ${row('Name', data.customerName)}
                ${row('Email', `<a href="mailto:${data.customerEmail}" style="color:#c65d3f;">${data.customerEmail}</a>`)}
                ${row('Phone', data.customerPhone ?? '—')}
              </table>
            </td>
          </tr>

          <!-- Event -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 8px 0;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#999490;">
                Event
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0ece4;border-radius:4px;overflow:hidden;">
                ${row('Date', formatDate(data.eventDate))}
                ${row('Type', data.eventType ?? '—')}
                ${row('Venue', data.venueName ?? '—')}
                ${row('Address', data.venueAddress ?? '—')}
                ${row('Guests', data.guestCount ? String(data.guestCount) : '—')}
                ${row('Notes', data.notes ?? '—')}
              </table>
            </td>
          </tr>

          <!-- Package & customisation -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 8px 0;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#999490;">
                Package &amp; customisation
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0ece4;border-radius:4px;overflow:hidden;">
                ${row('Package', `${data.packageLabel} (${data.packageId})`)}
                ${row('Template', data.templateChoice ?? '—')}
                ${row('Backdrop', data.backdropChoice ?? '—')}
                ${row('Add-ons', addOnsList)}
              </table>
            </td>
          </tr>

          <!-- Financials -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 8px 0;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#999490;">
                Financials
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0ece4;border-radius:4px;overflow:hidden;">
                ${row('Subtotal', formatCents(data.subtotalCents))}
                ${row('Deposit paid', `<span style="color:#c65d3f;font-weight:600;">${formatCents(data.depositCents)}</span>`)}
                ${row('Balance due', formatCents(data.subtotalCents - data.depositCents))}
                ${row('Stripe intent', `<code style="font-size:12px;">${data.stripeIntentId}</code>`)}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f1ea;padding:16px 32px;border-top:1px solid #e8e3db;">
              <p style="margin:0;font-size:11px;color:#999490;">
                MEMORIQ System · This message was generated automatically. Do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
