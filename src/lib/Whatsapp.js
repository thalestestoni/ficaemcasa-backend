const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class Whatsapp {
  sendMessage(message) {
    return client.messages.create(message);
  }
}

export default new Whatsapp();
