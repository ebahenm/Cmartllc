// utils/mailer.js
const nodemailer = require('nodemailer');

// configure once at startup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

/**
 * Send an email
 * @param {{ to: string, subject: string, text?: string, html?: string }} opts
 */
async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });
  return info;
}

module.exports = { sendMail };
