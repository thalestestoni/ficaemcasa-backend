import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import authConfig from '../../config/auth';
import formatPhone from '../utils/formatPhone';
import isPhone from '../utils/isPhone';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const { password } = req.body;

    let { login } = req.body;

    if (isPhone(login)) {
      login = formatPhone(login);
    }

    const user = await User.findOne({ login });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name, phone, active, nickname } = user;

    return res.json({
      user: {
        name,
        phone,
        active,
        nickname,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
