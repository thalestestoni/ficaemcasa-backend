import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

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

    let { login } = req.body;

    if (!isEmail(login) && !isPhone(login)) {
      return res.status(400).json({ error: 'Falha ao validar login' });
    }

    if (isEmail(login)) {
      login = login.toLowerCase();
    }

    if (isPhone(login)) {
      login = formatPhone(login);
    }

    const userExists = await User.findOne({ login });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'Este login já está sendo utilizado' });
    }

    const token = uuidv4();

    const now = new Date();
    now.setHours(now.getHours() + 1);

    const loginExists = await Login.findOne({ login });

    if (loginExists) {
      await Login.findOneAndUpdate({ login }, { token, tokenExpires: now });
    } else {
      await Login.create({ login, token, tokenExpires: now });
    }

    const frontUrl = process.env.FRONT_URL;

    if (isEmail(login)) {
      const email = login;
      try {
        await Mail.sendMail({
          to: `<${email}>`,
          subject: 'Fica em Casa App',
          text: `Link para ativar sua conta ${frontUrl}/second-signup/${token}/email`,
        });
      } catch (error) {
        return error;
      }
    }

    if (isPhone(login)) {
      const phone = login;
      /** Twilio Whatsapp and SMS */
      const message = {
        // from: process.env.TWILIO_WHATSAPP_NUMBER,
        // to: `whatsapp:${phone}`,
        from: process.env.TWILIO_SMS_NUMBER,
        body: `Fica em Casa App. Link para ativar sua conta ${frontUrl}/second-signup/${token}/phone`,
        to: phone,
      };

      try {
        await Twilio.sendMessage(message);
      } catch (error) {
        return res
          .status(error.status)
          .json({ error, twilioError: 'Não foi possível enviar a mensagem' });
      }
    }

    return res.send();
  }
}

export default new PhoneController();
