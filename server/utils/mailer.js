// server/utils/mailer.js
const nodemailer = require('nodemailer');

// configure once at startup
const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   465,
  secure: true,                    // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send an email via your SMTP transporter.
 * @param {{ to: string, subject: string, text?: string, html?: string }} opts
 */
async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,  // your Gmail address
    to,                           // recipient
    subject,                      
    text,
    html
  });
  return info;
}

module.exports = { sendMail };
