import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

/**
 * Sends a registration confirmation email
 * @param {Object} data 
 * @param {string} data.participant_name
 * @param {string} data.email
 * @param {string} data.registration_id
 * @param {string} data.team_name
 * @param {number} data.team_size
 * @param {string} data.registered_date
 * @param {Array<{icon: string, name: string, date: string, venue: string}>} data.events
 */
export async function sendRegistrationConfirmationEmail(data) {
  const eventsHtml = data.events && data.events.length > 0
    ? data.events.map(ev => `
        <div class="event-card">
          <div class="event-icon">${ev.icon || '📅'}</div>
          <div class="event-details">
            <div class="event-name">${ev.name}</div>
            <div class="event-meta">${ev.date}&nbsp;&nbsp;·&nbsp;&nbsp;${ev.venue}</div>
          </div>
          <div class="event-badge">Confirmed</div>
        </div>
      `).join('')
    : `<p style="color:rgba(255,255,255,0.4); font-size:13px;">No events registered.</p>`;

  const infoGridHtml = `
      <div class="info-item">
        <div class="info-item-label">Registration ID</div>
        <div class="info-item-value">${data.registration_id}</div>
      </div>
      <div class="info-item">
        <div class="info-item-label">Team Name</div>
        <div class="info-item-value">${data.team_name}</div>
      </div>
      <div class="info-item">
        <div class="info-item-label">Team Size</div>
        <div class="info-item-value">${data.team_size} Member${data.team_size !== 1 ? 's' : ''}</div>
      </div>
      <div class="info-item">
        <div class="info-item-label">Registered On</div>
        <div class="info-item-value">${data.registered_date}</div>
      </div>
      <div class="info-item">
        <div class="info-item-label">Events Count</div>
        <div class="info-item-value">${data.events.length} Event${data.events.length !== 1 ? 's' : ''}</div>
      </div>
  `;

  // Provide absolute URL for full schedule
  const scheduleUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL + '/schedule'
    : 'https://phoenix.udbhava.in/schedule';

  const eventsDisplay = data.events && data.events.length > 0 ? 'block' : 'none';
  const eventCountText1 = data.events.length === 1 ? 'event' : data.events.length + ' events';
  const eventCountText2 = data.events.length === 1 ? 'is' : 'are';

  const htmlContent = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Registration Confirmed — Phoenix 3.0</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
        rel="stylesheet" />

    <style>
        /* Reset */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; display: block; }
        a { text-decoration: none; }

        /* Main */
        body { background-color: #050505; font-family: 'Space Grotesk', Arial, sans-serif; color: #ffffff; margin: 0; padding: 0; }
        .email-wrapper { background-color: #050505; padding: 40px 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #0d0d0d; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 106, 0, 0.12); box-shadow: 0 0 60px rgba(255, 106, 0, 0.08), 0 0 120px rgba(0, 0, 0, 0.6); }

        /* Header */
        .header { background: linear-gradient(135deg, #0a0705 0%, #150c04 40%, #0a0a12 100%); padding: 48px 40px 40px; text-align: center; position: relative; border-bottom: 1px solid transparent; background-clip: padding-box; }
        .header-gradient-line { height: 2px; background: linear-gradient(90deg, transparent 0%, #c62f00 15%, #ff6900 30%, #ffb27c 50%, #57d2fd 75%, #00a2ff 85%, transparent 100%); }
        .checkmark-circle { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, rgba(255, 106, 0, 0.15), rgba(0, 162, 255, 0.1)); border: 2px solid rgba(255, 106, 0, 0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 24px rgba(255, 106, 0, 0.2); }
        .header-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; background: linear-gradient(135deg, #c62f00 0%, #f37b27 20%, #ff6900 35%, #ffb27c 55%, #57d2fd 78%, #00a2ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
        .header-subtitle { font-size: 14px; color: rgba(255, 255, 255, 0.5); font-weight: 500; letter-spacing: 0.01em; }

        /* Body */
        .body-section { padding: 36px 40px; }
        .greeting { font-size: 16px; color: rgba(255, 255, 255, 0.85); line-height: 1.6; margin-bottom: 28px; }
        .greeting strong { color: #ff6900; }

        /* Events Block */
        .section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255, 255, 255, 0.3); margin-bottom: 14px; }
        .event-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 12px; padding: 18px 20px; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 16px; }
        .event-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, rgba(255, 106, 0, 0.2), rgba(0, 162, 255, 0.1)); border: 1px solid rgba(255, 106, 0, 0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
        .event-details { flex: 1; }
        .event-name { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
        .event-meta { font-size: 12px; color: rgba(255, 255, 255, 0.4); font-weight: 500; }
        .event-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; background: rgba(255, 106, 0, 0.12); color: #ff6900; border: 1px solid rgba(255, 106, 0, 0.25); white-space: nowrap; align-self: center; }

        /* Divider */
        .divider { height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.07) 30%, rgba(255, 255, 255, 0.07) 70%, transparent 100%); margin: 28px 0; }

        /* Info Grid */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        .info-item { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 14px 16px; }
        .info-item-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.3); margin-bottom: 6px; }
        .info-item-value { font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.85); }

        /* CTA Button */
        .cta-wrapper { text-align: center; margin: 32px 0 12px; }
        .cta-button { display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #c62f00 0%, #ff6900 40%, #ffb27c 80%); color: #ffffff !important; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 8px; text-decoration: none; box-shadow: 0 0 30px rgba(255, 106, 0, 0.35); }

        /* Notice Box */
        .notice-box { background: rgba(0, 162, 255, 0.06); border: 1px solid rgba(0, 162, 255, 0.15); border-radius: 10px; padding: 16px 20px; margin-top: 28px; }
        .notice-box-title { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #57d2fd; margin-bottom: 6px; }
        .notice-box-text { font-size: 13px; color: rgba(255, 255, 255, 0.5); line-height: 1.6; }

        /* Footer */
        .footer { padding: 28px 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; }
        .footer-team { font-size: 12px; color: rgba(255, 255, 255, 0.3); margin-bottom: 12px; letter-spacing: 0.05em; }
        .footer-socials { margin-bottom: 16px; }
        .footer-socials a { display: inline-block; margin: 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255, 255, 255, 0.25); text-decoration: none; }
        .footer-copy { font-size: 11px; color: rgba(255, 255, 255, 0.15); }

        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 20px 12px; }
            .header, .body-section, .footer { padding-left: 24px; padding-right: 24px; }
            .header-title { font-size: 22px; }
            .info-grid { grid-template-columns: 1fr; }
            .event-card { flex-wrap: wrap; }
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header-gradient-line"></div>

            <!-- HEADER -->
            <div class="header">
                <div class="checkmark-circle" style="display:inline-flex;">
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="15" stroke="#ff6900" stroke-width="1.5" opacity="0.3" />
                        <path d="M9 16.5L13.5 21L23 11" stroke="#ff6900" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <h1 class="header-title">You're Registered!</h1>
                <p class="header-subtitle">Your spot has been confirmed. Get ready to rise.</p>
            </div>

            <!-- BODY -->
            <div class="body-section">
                <p class="greeting" id="greeting">
                    Hey <strong>${data.participant_name}</strong>,<br /><br />
                    We're thrilled to confirm your registration for <strong>Phoenix 3.0</strong>.
                    The ${eventCountText1} you've signed up for ${eventCountText2} locked in below. Prepare yourself — it's going to be legendary.
                </p>

                <div class="section-label" id="events-label" style="display:${eventsDisplay};">Registered Events</div>
                <div id="events-container">
                    ${eventsHtml}
                </div>

                <div class="divider"></div>

                <div class="section-label">Registration Details</div>
                <div class="info-grid" id="info-grid">
                    ${infoGridHtml}
                </div>

                <div class="cta-wrapper" id="cta-wrapper">
                    <a href="${scheduleUrl}" class="cta-button">View Full Schedule</a>
                </div>

                <div class="notice-box">
                    <div class="notice-box-title">📌 Good to Know</div>
                    <div class="notice-box-text">
                        Please carry a valid college ID on the event day. Arrive at least 15 minutes before your event begins. For
                        any queries, reach out to us on Instagram or email us at <a href="mailto:phoenix@udbhava.in" style="color:#57d2fd;">phoenix@udbhava.in</a>.
                    </div>
                </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
                <div class="footer-team">Made with ❤️ by Team Udbhava</div>
                <div class="footer-socials">
                    <a href="https://instagram.com/teamudbhava" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://twitter.com/teamudbhava" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
                    <a href="https://linkedin.com/company/teamudbhava" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <div class="footer-copy">© 2026 Phoenix 3.0. All rights reserved.</div>
            </div>

            <div class="header-gradient-line" style="background: linear-gradient(90deg, transparent 0%, #00a2ff 15%, #57d2fd 30%, #ffb27c 50%, #ff6900 75%, #c62f00 85%, transparent 100%);"></div>
        </div>
    </div>
</body>
</html>`;

  const mailOptions = {
    from: '"Phoenix 3.0" <' + process.env.EMAIL_USER + '>',
    to: data.email,
    subject: "Registration Confirmed — Phoenix 3.0",
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
