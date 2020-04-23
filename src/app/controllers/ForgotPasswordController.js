import crypto from 'crypto';
import * as Yup from 'yup';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import Twilio from '../../lib/Twilio';
import Mail from '../../lib/Mail';

import User from '../models/User';

class ForgotPasswordController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const { login } = req.body;

    if (isEmail(login)) {
      const email = login;

      const user = await User.findOne({ login: email });

      if (!user) {
        return res.status(400).json({ error: 'Email não encontrado' });
      }

      const token = crypto.randomBytes(3).toString('hex');

      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);

      await user.update({
        passwordResetToken: token,
        passwordResetExpires: now,
      });

      try {
        await Mail.sendMail({
          to: `<${email}>`,
          subject: 'Fica em Casa App',
          text: `Código de verificação ${token}`,
        });
      } catch (error) {
        return error;
      }

      return res.send();
    }

    if (isPhone(login)) {
      const phone = formatPhone(req.body.phone);

      const user = await User.findOne({ login: phone });

      if (!user) {
        return res.status(400).json({ error: 'Telefone não encontrado' });
      }

      const token = crypto.randomBytes(3).toString('hex');

      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);

      await user.update({
        passwordResetToken: token,
        passwordResetExpires: now,
      });

      /** Twilio Whatsapp and SMS */
      const message = {
        // from: process.env.TWILIO_WHATSAPP_NUMBER,
        // to: `whatsapp:${user.phone}`,
        from: process.env.TWILIO_SMS_NUMBER,
        body: `Código de recuperação para o Fica em Casa App: ${token}`,
        to: user.phone,
      };

      try {
        await Twilio.sendMessage(message);
      } catch (error) {
        return res
          .status(500)
          .json({ error, twilioError: 'Não foi possível enviar a mensagem' });
      }

      return res.send();
    }

    return res.status(400).json({
      error:
        'Não foi possível enviar uma código de recuperação para o login informado',
    });
  }
}

export default new ForgotPasswordController();
