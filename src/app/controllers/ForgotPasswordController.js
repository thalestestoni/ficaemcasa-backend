import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import ResetPasswordMail from '../jobs/ResetPasswordMail';
import ResetPasswordSMS from '../jobs/ResetPasswordSMS';

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
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const token = uuidv4();

    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    await user.update({
      passwordResetToken: token,
      passwordResetExpires: now,
    });

    if (isEmail(login)) {
      const data = { user, token };

      await ResetPasswordMail.handle(data);
    }

    if (isPhone(login)) {
      const data = { phone: login, token };

      await ResetPasswordSMS.handle(data);
    }

    return res.send();
  }
}

export default new ForgotPasswordController();
