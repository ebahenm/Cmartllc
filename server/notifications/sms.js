// server/notifications/sms.js
require('dotenv').config();
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE, // your Twilio number
      to: to
    });
    console.log('SMS sent, ID:', response.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

module.exports = { sendSMS };
