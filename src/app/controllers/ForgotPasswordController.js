import crypto from 'crypto';
import User from '../models/User';
import Twilio from '../../lib/Twilio';

class ForgotPasswordController {
  async store(req, res) {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ error: 'Telefone não encontrado' });
    }

    const token = crypto.randomBytes(3).toString('hex');

    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    await user.update({ passwordResetToken: token, passwordResetExpires: now });

    /** Twilio Whatsapp and SMS */
    const message = {
      // from: process.env.TWILIO_WHATSAPP_NUMBER,
      // to: `whatsapp:${user.phone}`,
      from: process.env.TWILIO_SMS_NUMBER,
      body: `Código de recuperação para o Fica em Casa App: ${token}`,
      to: user.phone,
    };

    const response = await Twilio.sendMessage(message);

    if (response.error) {
      return res
        .status(500)
        .json({ error: 'Não foi possível enviar mensagem para o whatsapp' });
    }

    return res.send();
  }
}

export default new ForgotPasswordController();
