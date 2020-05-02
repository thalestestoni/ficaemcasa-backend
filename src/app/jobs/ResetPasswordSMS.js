import Twilio from '../../lib/Twilio';

const frontUrl = process.env.FRONT_URL;

class SignupMail {
  async handle(data) {
    const { token, phone } = data;

    const message = {
      /** Twilio Whatsapp and SMS */
      // to: `whatsapp:${phone}`,
      // from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: phone,
      from: process.env.TWILIO_SMS_NUMBER,
      body: `Fica em Casa App. Link para cadastar nova senha ${frontUrl}/second-signup/${token}/phone`,
    };

    await Twilio.sendMessage(message);
  }
}

export default new SignupMail();
