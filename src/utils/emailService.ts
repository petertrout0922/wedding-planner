import { supabase } from './supabase';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailParams): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email send failed:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendWeddingInvitation = async (
  guestEmail: string,
  guestName: string,
  coupleNames: string,
  weddingDate: string,
  venue: string
): Promise<boolean> => {
  const subject = `You're Invited to ${coupleNames}'s Wedding!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
        .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details p { margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You're Invited!</h1>
        </div>
        <div class="content">
          <p>Dear ${guestName},</p>
          <p>We are delighted to invite you to celebrate our wedding!</p>

          <div class="details">
            <p><strong>Couple:</strong> ${coupleNames}</p>
            <p><strong>Date:</strong> ${weddingDate}</p>
            <p><strong>Venue:</strong> ${venue}</p>
          </div>

          <p>Your presence would mean the world to us as we begin this new chapter together.</p>
          <p>Please RSVP at your earliest convenience.</p>

          <p>With love,<br>${coupleNames}</p>
        </div>
        <div class="footer">
          <p>This invitation was sent via Wedding Planner</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${guestName},

You're invited to ${coupleNames}'s Wedding!

Date: ${weddingDate}
Venue: ${venue}

Your presence would mean the world to us as we begin this new chapter together.

Please RSVP at your earliest convenience.

With love,
${coupleNames}
  `;

  return sendEmail({ to: guestEmail, subject, html, text });
};
