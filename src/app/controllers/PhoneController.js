import * as Yup from 'yup';
import crypto from 'crypto';

import Twilio from '../../lib/Twilio';

import Phone from '../models/Phone';
import User from '../models/User';
import formatPhone from '../../utils/formatPhone';

class PhoneController {
  async store(req, res) {
    const schema = Yup.object().shape({
      phone: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const phone = formatPhone(req.body.phone);

    const registeredPhone = await Phone.findOne({ phone });

    if (registeredPhone && registeredPhone.activated) {
      return res.status(400).json({ error: 'O telefone já está ativado' });
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res
        .status(400)
        .json({ error: 'O telefone já está sendo utilizado' });
    }

    const token = crypto.randomBytes(3).toString('hex');

    const now = new Date();
    now.setMinutes(now.getMinutes() + 2);

    if (registeredPhone) {
      await Phone.findOneAndUpdate({ phone }, { token, tokenExpires: now });
    } else {
      await Phone.create({
        phone,
        token,
        tokenExpires: now,
      });
    }

    /** Twilio Whatsapp and SMS */
    const message = {
      // from: process.env.TWILIO_WHATSAPP_NUMBER,
      // to: `whatsapp:${user.phone}`,
      from: process.env.TWILIO_SMS_NUMBER,
      body: `Código de verificação para o Fica em Casa App: ${token}`,
      to: phone,
    };

    try {
      await Twilio.sendMessage(message);
    } catch (error) {
      return res
        .status(error.status)
        .json({ error, twilioError: 'Não foi possível enviar a mensagem' });
    }

    return res.send();
  }
}

export default new PhoneController();
