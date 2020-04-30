import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import User from '../models/User';

class ResetPasswordController {
  async store(req, res) {
    const schema = Yup.object().shape({
      token: Yup.string().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados informados estão inválidos!' });
    }

    const { token } = req.body;

    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (user.passwordResetExpires < new Date()) {
      return res
        .status(400)
        .json({ error: 'Código de verificação expirou, gere um novo' });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'A senha e a confirmação de senha não estão iguais' });
    }

    try {
      const password_hash = await bcrypt.hash(password, 8);
      user.password = password_hash;
    } catch (error) {
      return error;
    }

    user.passwordResetToken = '';
    user.passwordResetExpires = '';

    user.save();

    return res.send();
  }
}

export default new ResetPasswordController();
