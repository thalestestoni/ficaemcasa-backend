import * as Yup from 'yup';

import toTitleCase from 'to-title-case';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import User from '../models/User';
import Login from '../models/Login';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      name: Yup.string().required(),
      phone: Yup.string().required(),
      isNeedy: Yup.boolean().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required().min(6),
      useTermsRead: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const { login } = req.body;

    if (isEmail(login)) {
      const email = login;

      const emailExists = await User.findOne({ login: email });

      if (emailExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const registeredEmail = await Login.findOne({ login: email });

      if (!registeredEmail) {
        return res.status(400).json({ error: 'Email não cadastrado ainda' });
      }

      if (!registeredEmail.activated) {
        return res
          .status(400)
          .json({ error: 'Este email ainda não foi ativado' });
      }

      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({
          error: 'A senha e a confirmação de senha não estão iguais.',
        });
      }

      req.body.name = toTitleCase(req.body.name);
      req.body.phone = formatPhone(req.body.phone);

      try {
        const { id, name, phone, active, nickname, avatar } = await User.create(
          req.body
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

    if (isPhone(login)) {
      const phone = formatPhone(login);

      const phoneExists = await User.findOne({ login: phone });

      if (phoneExists) {
        return res.status(400).json({ error: 'Telefone já cadastrado' });
      }

      const registeredPhone = await Login.findOne({ login: phone });

      if (!registeredPhone) {
        return res.status(400).json({ error: 'Telefone não cadastrado ainda' });
      }

      if (!registeredPhone.activated) {
        return res
          .status(400)
          .json({ error: 'Este telefone ainda não foi ativado' });
      }

      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({
          error: 'A senha e a confirmação de senha não estão iguais.',
        });
      }

      req.body.name = toTitleCase(req.body.name);
      req.body.phone = formatPhone(req.body.phone);

      try {
        const { id, name, active, nickname } = await User.create(req.body);

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
      } catch (error) {
        return res.json(error);
      }
    }

    return res
      .status(400)
      .json({ error: 'Não foi possível cadastrar o usuário' });
  }

  async show(req, res) {
    const { id } = req.params;

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

    return res.json(user);
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

    console.log(req.userId);

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
