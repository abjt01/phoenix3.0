import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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
    ? data.events.map((ev, i) => `
        <div class="event-block">
          <div class="event-name">${ev.name}</div>
          <div class="detail-row"><span class="detail-key">Date & Time</span><span class="detail-val">${ev.date || 'TBD'}</span></div>
          <div class="detail-row"><span class="detail-key">Venue</span><span class="detail-val">${ev.venue || 'TBD'}</span></div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #ff6900; margin-bottom: 10px;">
              📱 Join WhatsApp Group
            </div>
            <p style="font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.5; margin-bottom: 12px;">
              Important updates for <strong>${ev.name}</strong> will be shared here.
            </p>
            <a href="${ev.whatsapp_link || '#'}" class="btn" style="padding: 10px 20px; font-size: 11px;">👉 Join Group</a>
          </div>
        </div>
      `).join('')
    : '<p style="color:rgba(255,255,255,0.4); font-size:13px;">No events registered.</p>';

  const headline = `Hi ${data.participant_name}, you're registered for Phoenix 3.0!`;

  // Read the HTML template from the filesystem
  const templatePath = path.join(process.cwd(), 'emails', 'registration-confirmation.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  // Inject variables
  htmlContent = htmlContent
    .replace('{{HEADLINE}}', headline)
    .replace('{{EVENTS_HTML}}', eventsHtml);

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
