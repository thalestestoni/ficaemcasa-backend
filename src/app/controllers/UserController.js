import * as Yup from 'yup';

import toTitleCase from 'to-title-case';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import User from '../models/User';
import Signup from '../models/Signup';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      token: Yup.string().required(),
      name: Yup.string().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required().min(6),
      useTermsRead: Yup.boolean().required(),
      phone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const tempLogin = await Signup.findOne({ token: req.body.token });

    if (!tempLogin) {
      return res
        .status(400)
        .json({ error: 'Email ou telefone não cadastrado ainda' });
    }

    if (isEmail(tempLogin.login)) {
      if (!req.body.phone) {
        return res
          .status(400)
          .json({ error: 'Você precisa informar o telefone' });
      }

      if (!isPhone(req.body.phone)) {
        return res.status(400).json({ error: 'Formato de telefone inválido' });
      }
    }

    if (tempLogin.tokenExpires < new Date()) {
      return res
        .status(400)
        .json({ error: 'Código de verificação expirou, gere um novo' });
    }

    const user = await User.findOne({ login: tempLogin.login });

    if (user) {
      return res.status(400).json({ error: 'Login já existe' });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'A senha e a confirmação de senha não estão iguais.',
      });
    }

    const userToAdd = req.body;

    delete userToAdd.token;

    try {
      const password_hash = await bcrypt.hash(password, 8);
      userToAdd.password = password_hash;
    } catch (error) {
      console.log(error);
      return error;
    }

    userToAdd.name = toTitleCase(userToAdd.name);

    if (isEmail(tempLogin.login)) {
      const { login } = tempLogin;
      userToAdd.email = login.toLowerCase();
      userToAdd.login = login.toLowerCase();
    } else if (isPhone(tempLogin.login)) {
      userToAdd.phone = formatPhone(userToAdd.phone);
    }

    try {
      const { id, name, phone, active, nickname, avatar } = await User.create(
        userToAdd
      );

      return res.json({
        user: {
          name,
          phone,
          active,
          nickname,
          photoUrl: avatar.url,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return res.json(error);
    }
  }

  async show(req, res) {
    let { id } = req.params;

    if (!id) {
      id = req.userId;
    }

    const user = await User.findById(id, {
      _id: 0,
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    if (!user) {
      return res.status(500).json({ error: 'Usuário não encontrado' });
    }

    return res.json({
      name: user.name,
      photoUrl: user.avatar.url,
      nickname: user.nickname,
      isActive: user.active,
      phone: user.phone,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      password: Yup.string().min(6),
      oldPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const userToUpdate = req.body;

    const { login, password, confirmPassword, oldPassword } = req.body;

    if (login) {
      return res
        .status(401)
        .json({ error: 'Não é permitido atualização de login no momento' });
    }

    if (oldPassword) {
      const oldPasswordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!oldPasswordMatch) {
        return res
          .status(401)
          .json({ error: 'A sua antiga senha está incorreta!' });
      }

      if (password && password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: 'A senha e a confirmacão de senha nao são iguais' });
      }

      userToUpdate.password = await bcrypt.hash(password, 8);
    }

    const { latitude, longitude } = req.body;

    if (latitude && longitude) {
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      userToUpdate.location = location;
    }

    const { id, name, phone, nickname, active } = await User.findByIdAndUpdate(
      req.userId,
      userToUpdate
    );

    return res.json({
      id,
      name,
      phone,
      nickname,
      active,
    });
  }

  async destroy(req, res) {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (user.id !== userId) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para remover este usuário' });
    }

    await user.remove();

    await Necessity.deleteMany({ userId });
    await Assist.deleteMany({ userId });

    return res.send();
  }
}

export default new UserController();
