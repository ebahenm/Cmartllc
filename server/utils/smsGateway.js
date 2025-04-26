// utils/smsGateway.js

const { sendMail } = require('./mailer');

/**
 * Send SMS via carrier email‑to‑SMS gateway
 * @param {{ to: string, carrierGateway: string, text: string }} opts
 */
async function sendSms({ to, carrierGateway, text }) {
  if (!to || !carrierGateway) {
    throw new Error('Both phone number (to) and carrierGateway are required');
  }
  const address = `${to}@${carrierGateway}`;    // e.g. "15041234567@vtext.com"
  return sendMail({
    to:      address,
    subject: '',    // SMS gateways ignore subject
    text
  });
}

module.exports = { sendSms };
