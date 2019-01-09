const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = process.env;

const client = new require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function sendSMS(body) {
    const {TWILIO_NUMBER, TARGET_NUMBER} = process.env;

    client.messages.create({
        from: TWILIO_NUMBER,
        to:   TARGET_NUMBER,
        body
    })
        .then(message => console.log(`Send SMS id ${message.sid} !`));
}

module.exports = {
    client,
    sendSMS
};