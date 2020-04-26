import * as Yup from 'yup';

import formatPhone from '../utils/formatPhone';
import isPhone from '../utils/isPhone';

import User from '../models/User';

class ResetPasswordController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      token: Yup.string().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados informados estão inválidos!' });
    }

    const { password, confirmPassword } = req.body;

    const token = req.body.token.split(' ').join('');

    let { login } = req.body;

    if (isPhone(login)) {
      login = formatPhone(login);
    }

    const user = await User.findOne({ login });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).json({ error: 'Codigo de verificação incorreto' });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'A senha e a confirmação de senha não estão iguais' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res
        .status(400)
        .json({ error: 'Código de verificação expirou, gere um novo' });
    }

    user.password = password;

    user.save();

    return res.send();
  }
}

export default new ResetPasswordController();
