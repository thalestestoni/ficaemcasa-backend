import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

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

    let { login } = req.body;

    if (!isEmail(login) && !isPhone(login)) {
      return res.status(400).json({ error: 'Falha ao validar login' });
    }

    if (isPhone(login)) {
      login = formatPhone(login);
    }

    if (isEmail(login)) {
      login = login.toLowerCase();
    }

    const user = await User.findOne({ login });

    if (!user) {
      return res.status(400).json({ error: 'Login não encontrado' });
    }

    const token = uuidv4();

    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    await user.update({
      passwordResetToken: token,
      passwordResetExpires: now,
    });

    const frontUrl = process.env.FRONT_URL;

    if (isEmail(login)) {
      const email = login;
      try {
        await Mail.sendMail({
          to: `<${email}>`,
          subject: 'Fica em Casa App',
          text: `Link para cadastrar uma nova senha ${frontUrl}/second-signup/${token}/email`,
        });
      } catch (error) {
        return error;
      }
    }

    if (isPhone(login)) {
      const phone = formatPhone(req.body.phone);

      /** Twilio Whatsapp and SMS */
      const message = {
        // from: process.env.TWILIO_WHATSAPP_NUMBER,
        // to: `whatsapp:${phone}`,
        from: process.env.TWILIO_SMS_NUMBER,
        body: `Fica em Casa App. Link para cadastrar uma nova senha ${frontUrl}/second-signup/${token}/email`,
        to: phone,
      };

      try {
        await Twilio.sendMessage(message);
      } catch (error) {
        return res
          .status(500)
          .json({ error, twilioError: 'Não foi possível enviar a mensagem' });
      }
    }

    return res.send();
  }
}

export default new ForgotPasswordController();
