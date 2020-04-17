import crypto from 'crypto';
import User from '../models/User';
// import Whatsapp from '../../lib/Whatsapp';
import SMS from '../../lib/SMS';

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

    // Whatsapp
    // const message = {
    //   from: process.env.TWILIO_WHATSAPP_NUMBER,
    //   body: `Código de recuperação para o Fica em Casa App: ${token}`,
    //   to: `whatsapp:${user.phone}`,
    // };
    // const response = await Whatsapp.sendMessage(message);
    // if (response.errorMessage) {
    //   return res
    //     .status(500)
    //     .json({ error: 'Não foi possível enviar mensagem para o whatsapp' });
    // }

    const params = {
      Message: `Código de recuperação para o Fica em Casa App: ${token}`,
      PhoneNumber: user.phone,
    };

    const response = SMS.sendSMS(params);

    if (response.err) {
      return res.status(500).json({
        error: 'Não foi possível enviar o código de verificacão por SMS',
      });
    }

    return res.send();
  }
}

export default new ForgotPasswordController();
