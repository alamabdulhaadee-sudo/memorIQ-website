import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

export const dynamic = 'force-dynamic';

interface ContactPayload {
  name:       string;
  email:      string;
  eventDate?: string; // ISO date or empty string
  message:    string;
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { name, email, eventDate, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const subject = eventDate?.trim()
    ? `New inquiry from ${name} — event ${formatDate(eventDate.trim())}`
    : `New inquiry from ${name}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Contact Inquiry</title></head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:6px;overflow:hidden;">
          <tr>
            <td style="background:#1a1613;padding:24px 32px;">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,241,234,0.4);">MEMORIQ Website</p>
              <h1 style="margin:0;font-size:20px;font-weight:500;color:#f4f1ea;letter-spacing:-0.02em;">New contact inquiry</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ece4;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:10px 16px;font-size:12px;font-weight:500;color:#999490;width:120px;border-bottom:1px solid #f0ece4;">Name</td>
                  <td style="padding:10px 16px;font-size:13px;color:#1a1613;border-bottom:1px solid #f0ece4;border-left:1px solid #f0ece4;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;font-weight:500;color:#999490;border-bottom:1px solid #f0ece4;">Email</td>
                  <td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #f0ece4;border-left:1px solid #f0ece4;">
                    <a href="mailto:${email}" style="color:#c65d3f;">${email}</a>
                  </td>
                </tr>
                ${eventDate?.trim() ? `<tr>
                  <td style="padding:10px 16px;font-size:12px;font-weight:500;color:#999490;border-bottom:1px solid #f0ece4;">Event date</td>
                  <td style="padding:10px 16px;font-size:13px;color:#1a1613;border-bottom:1px solid #f0ece4;border-left:1px solid #f0ece4;">${formatDate(eventDate.trim())}</td>
                </tr>` : ''}
              </table>
              <p style="margin:0 0 8px 0;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#999490;">Message</p>
              <p style="margin:0;font-size:14px;color:#4a4540;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f1ea;padding:16px 32px;border-top:1px solid #e8e3db;">
              <p style="margin:0;font-size:11px;color:#999490;">Reply directly to this email to respond to ${name}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    from:    'MEMORIQ Website <system@memoriq.co>',
    to:      'hello@memoriq.co',
    replyTo: email,
    subject,
    html,
  });

  if (!result.success) {
    console.error('[contact] email failed:', result.error);
    return NextResponse.json({ error: 'Email failed to send.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
