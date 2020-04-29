import * as Yup from 'yup';
import crypto from 'crypto';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import Twilio from '../../lib/Twilio';
import Mail from '../../lib/Mail';

import Login from '../models/Login';
import User from '../models/User';

class PhoneController {
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
      const email = login.toLowerCase();

      const loginExists = await User.findOne({ login: email });

      if (loginExists) {
        return res
          .status(400)
          .json({ error: 'O email já está sendo utilizado' });
      }

      const token = crypto.randomBytes(3).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      const registeredEmail = await Login.findOne({ login: email });

      if (registeredEmail) {
        await Login.findOneAndUpdate(
          { login: email },
          { token, tokenExpires: now }
        );
      } else {
        await Login.create({
          login: email,
          token,
          tokenExpires: now,
        });
      }

      const frontUrl = process.env.FRONT_URL;

      try {
        await Mail.sendMail({
          to: `<${email}>`,
          subject: 'Fica em Casa App',
          text: `Link para ativar sua conta ${frontUrl}/second-signup/${token}/email`,
        });
      } catch (error) {
        return error;
      }

      return res.json({ success: 'Email enviado' });
    }

    if (isPhone(login)) {
      const phone = formatPhone(login);

      const loginExists = await User.findOne({ login: phone });

      if (loginExists) {
        return res
          .status(400)
          .json({ error: 'O telefone já está sendo utilizado' });
      }

      const token = crypto.randomBytes(3).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      const registeredPhone = await Login.findOne({ login: phone });

      if (registeredPhone) {
        await Login.findOneAndUpdate(
          { login: phone },
          { token, tokenExpires: now }
        );
      } else {
        await Login.create({
          login: phone,
          token,
          tokenExpires: now,
        });
      }

      /** Twilio Whatsapp and SMS */
      const message = {
        // from: process.env.TWILIO_WHATSAPP_NUMBER,
        // to: `whatsapp:${user.phone}`,
        from: process.env.TWILIO_SMS_NUMBER,
        body: `Link para ativar sua conta ${frontUrl}/second-signup/${token}/telphone`,
        to: phone,
      };

      try {
        await Twilio.sendMessage(message);
      } catch (error) {
        return res
          .status(error.status)
          .json({ error, twilioError: 'Não foi possível enviar a mensagem' });
      }

      return res.json({ success: 'SMS enviado' });
    }

    return res.status(400).json({ error: 'Não foi possível validar o login' });
  }
}

export default new PhoneController();
