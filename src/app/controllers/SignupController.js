import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import SignupMail from '../jobs/SignupMail';
import SignupSMS from '../jobs/SignupSMS';

import Signup from '../models/Signup';
import User from '../models/User';

class SignupController {
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
      return res.status(400).json({
        error:
          'Este email ou telefone já foi cadastrado. Por favor, vá para a seção de login ou esqueci minha senha.',
      });
    }

    const token = uuidv4();

    const now = new Date();
    now.setHours(now.getHours() + 1);

    const loginExists = await Signup.findOne({ login });

    if (loginExists) {
      await Signup.findOneAndUpdate({ login }, { token, tokenExpires: now });
    } else {
      await Signup.create({ login, token, tokenExpires: now });
    }

    if (isEmail(login)) {
      const data = { email: login, token };

      await SignupMail.handle(data);
    }

    if (isPhone(login)) {
      const data = { phone: login, token };

      await SignupSMS.handle(data);
    }

    return res.send();
  }
}

export default new SignupController();
