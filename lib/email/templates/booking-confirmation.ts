// Booking confirmation email — sent to the customer after successful payment.
// Plain HTML with inline CSS. No React Email dependency.

export interface BookingConfirmationData {
  customerName:   string;
  customerEmail:  string;
  eventDate:      string;   // ISO "YYYY-MM-DD"
  packageLabel:   string;   // e.g. "Signature"
  packageMeta:    string;   // e.g. "3 hours"
  venueName?:     string;
  venueAddress?:  string;
  subtotalCents:  number;
  depositCents:   number;   // always 10000
  balanceDueCents: number;
  addOns:         string[]; // human-readable add-on names
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

function balanceDueDate(eventIso: string): string {
  const [y, m, d] = eventIso.split('-').map(Number);
  const due = new Date(y, m - 1, d - 14);
  return due.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Subject ───────────────────────────────────────────────────────────────────

export function bookingConfirmationSubject(eventDate: string): string {
  return `Your MEMORIQ booking is confirmed — ${formatDate(eventDate)}`;
}

// ── HTML body ─────────────────────────────────────────────────────────────────

export function bookingConfirmationHtml(data: BookingConfirmationData): string {
  const displayDate   = formatDate(data.eventDate);
  const dueDate       = balanceDueDate(data.eventDate);
  const balance       = formatCents(data.balanceDueCents);
  const deposit       = formatCents(data.depositCents);
  const subtotal      = formatCents(data.subtotalCents);

  const addOnRows = data.addOns.length > 0
    ? data.addOns
        .map(
          (name) =>
            `<tr>
              <td style="padding:6px 0;font-size:14px;color:#4a4540;">${name}</td>
              <td style="padding:6px 0;font-size:14px;color:#4a4540;text-align:right;">included / TBD</td>
            </tr>`,
        )
        .join('')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MEMORIQ Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1613;padding:36px 40px;">
              <p style="margin:0 0 20px 0;font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,241,234,0.5);">
                — PHOTO BOOTH / GTA
              </p>
              <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:500;letter-spacing:-0.03em;color:#f4f1ea;line-height:1;">
                You're all set.
              </h1>
              <p style="margin:0;font-size:14px;color:rgba(244,241,234,0.6);line-height:1.5;">
                Confirmation's headed to your inbox. We'll reach out 2 weeks before to lock in the final details.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <p style="margin:0 0 4px 0;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#999490;">
                Hi ${data.customerName.split(' ')[0]},
              </p>
              <p style="margin:0 0 32px 0;font-size:15px;color:#4a4540;line-height:1.6;">
                Your booking is confirmed. Here's the summary.
              </p>

              <!-- Booking summary box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f4f1ea;border-radius:4px;padding:24px;margin-bottom:32px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#999490;border-bottom:0.5px solid #d8d3cb;">
                          Date
                        </td>
                        <td style="padding:8px 0;font-size:11px;text-align:right;color:#1a1613;font-weight:500;border-bottom:0.5px solid #d8d3cb;">
                          ${displayDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#999490;border-bottom:0.5px solid #d8d3cb;">
                          Package
                        </td>
                        <td style="padding:8px 0;font-size:11px;text-align:right;color:#1a1613;font-weight:500;border-bottom:0.5px solid #d8d3cb;">
                          ${data.packageLabel} (${data.packageMeta})
                        </td>
                      </tr>
                      ${data.venueName ? `
                      <tr>
                        <td style="padding:8px 0;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#999490;border-bottom:0.5px solid #d8d3cb;">
                          Venue
                        </td>
                        <td style="padding:8px 0;font-size:11px;text-align:right;color:#1a1613;font-weight:500;border-bottom:0.5px solid #d8d3cb;">
                          ${data.venueName}${data.venueAddress ? `, ${data.venueAddress}` : ''}
                        </td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:8px 0;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#999490;">
                          Deposit paid
                        </td>
                        <td style="padding:8px 0;font-size:11px;text-align:right;color:#c65d3f;font-weight:600;">
                          ${deposit}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Financial breakdown -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td colspan="2" style="padding-bottom:12px;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#999490;border-bottom:0.5px solid #d8d3cb;">
                    Order total
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#4a4540;">${data.packageLabel} (${data.packageMeta})</td>
                  <td style="padding:8px 0;font-size:14px;color:#4a4540;text-align:right;">${subtotal}</td>
                </tr>
                ${addOnRows}
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#4a4540;border-top:0.5px solid #d8d3cb;">Deposit paid today</td>
                  <td style="padding:8px 0;font-size:14px;color:#c65d3f;font-weight:600;text-align:right;border-top:0.5px solid #d8d3cb;">${deposit}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#4a4540;">
                    Balance due ${dueDate}
                  </td>
                  <td style="padding:8px 0;font-size:14px;color:#1a1613;font-weight:500;text-align:right;">${balance}</td>
                </tr>
              </table>

              <!-- What happens next -->
              <p style="margin:0 0 12px 0;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#999490;">
                What happens next
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  'Confirmation email within 5 minutes (you\'re reading it)',
                  'Pre-event call 2 weeks before to lock in final details',
                  'Our team arrives 1 hour before your event start time',
                ]
                  .map(
                    (item, i) =>
                      `<tr>
                        <td style="padding:8px 0;font-size:14px;color:#4a4540;border-bottom:0.5px solid #f0ece4;">
                          <span style="color:#c65d3f;font-weight:600;margin-right:12px;">0${i + 1}</span>${item}
                        </td>
                      </tr>`,
                  )
                  .join('')}
              </table>

              <!-- CTA -->
              <p style="margin:0 0 8px 0;font-size:14px;color:#4a4540;line-height:1.6;">
                Questions before the event? Reply to this email or reach us at
                <a href="mailto:hello@memoriq.co" style="color:#c65d3f;text-decoration:none;">hello@memoriq.co</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f1ea;padding:24px 40px;border-top:0.5px solid #d8d3cb;">
              <p style="margin:0;font-size:12px;color:#999490;line-height:1.5;">
                MEMORIQ Photo Booth · Greater Toronto Area<br />
                <a href="https://memoriq.co" style="color:#999490;">memoriq.co</a>
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
