import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import authConfig from '../../config/auth';
import formatPhone from '../utils/formatPhone';
import isPhone from '../utils/isPhone';
import isEmail from '../utils/isEmail';
import cookieConfig from '../utils/cookieConfig';
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

    const { password } = req.body;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const { id, name, phone, active, nickname, avatar } = user;

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    res.cookie('token', token, cookieConfig);

    return res.json({
      user: {
        name,
        phone,
        active,
        nickname,
        photoUrl: avatar.url,
      },
    });
  }
}

export default new SessionController();
