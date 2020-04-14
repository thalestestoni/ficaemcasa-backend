import * as Yup from 'yup';

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
        .json({ error: 'The password does not match with confirm password.' });
    }

    const password_hash = await bcrypt.hash(password, 8);

    const userToAdd = req.body;

    userToAdd.password_hash = password_hash;

    const { id, name } = await User.create(userToAdd);

    return res.json({
      user: {
        id,
        name,
        phone,
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
      password_hash: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    if (!user) {
      return res.status(500).json({ error: 'User not found' });
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
      return res.status(400).json({ error: 'Failed to validate fields' });
    }

    const user = await User.findById(req.userId);

    const { phone, oldPassword, password } = req.body;

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });

      if (phoneExists) {
        return res.status(400).json({ error: 'Phone already exists.' });
      }
    }

    if (oldPassword) {
      const oldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password_hash
      );

      if (oldPassword && !oldPasswordMatch) {
        return res.status(401).json({ error: 'Password does not match' });
      }
    }

    const password_hash = await bcrypt.hash(password, 8);

    const userToUpdate = req.body;

    userToUpdate.password_hash = password_hash;

    const { id, name } = await User.findByIdAndUpdate(req.userId, userToUpdate);

    return res.json({
      id,
      name,
      phone,
    });
  }

  async destroy(req, res) {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.id !== userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete this user" });
    }

    await user.remove();

    await Necessity.deleteMany({ user_id: userId });
    await Assist.deleteMany({ user_id: userId });

    return res.send();
  }
}

export default new UserController();
