
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendVerificationSms(phoneNumber, otp) {
    try {
        const sms = await client.messages.create({
            body: otp, // Your custom message
            messagingServiceSid: "MG9bbe23dc9ed85ec636a31670c3bf273d",
            to: phoneNumber,
        });

        console.log(`Message sent to ${phoneNumber}:`);
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
}

module.exports = {
    sendVerificationSms,
};