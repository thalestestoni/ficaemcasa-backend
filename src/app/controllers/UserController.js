import * as Yup from 'yup';

import toTitleCase from 'to-title-case';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import User from '../models/User';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone: Yup.string().required(),
      isNeedy: Yup.boolean().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados informados estão inválidos!' });
    }

    const { phone, password, confirmPassword } = req.body;

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res
        .status(400)
        .json({ error: 'O telefone informado já está cadastrado!' });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'A senha e a confirmação de senha não estão iguais.' });
    }

    req.body.name = toTitleCase(req.body.name);

    const { id, name, active } = await User.create(req.body);

    return res.json({
      user: {
        name,
        phone,
        active,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
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
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
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

    const { phone, oldPassword } = req.body;

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });

      if (phoneExists) {
        return res
          .status(400)
          .json({ error: 'O telefone inserido já existe!' });
      }
    }

    if (oldPassword) {
      const oldPasswordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!oldPasswordMatch) {
        return res
          .status(401)
          .json({ error: 'A sua antiga senha está incorreta!' });
      }
    }

    const { latitude, longitude } = req.body;

    if (latitude && longitude) {
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      req.body = { location };
    }

    const { id, name, nickname, active } = await User.findByIdAndUpdate(
      req.userId,
      req.body
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
