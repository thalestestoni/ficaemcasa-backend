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
      body: `Olá! Clique no link abaixo para redefinir a sua senha ${frontUrl}/forgot-password/${token}`,
    };

    await Twilio.sendMessage(message);
  }
}

export default new SignupMail();
