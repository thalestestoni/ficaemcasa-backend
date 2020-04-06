import * as Yup from 'yup';

import bcrypt from 'bcryptjs';

import User from '../models/User';
import Necessity from '../models/Necessity';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      childrens: Yup.string().required(),
      phone: Yup.number().required(),
      birthday: Yup.string().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'The password does not match with confirm password.' });
    }

    const password_hash = await bcrypt.hash(password, 8);

    const { id, name, email } = await User.create({
      name: req.body.name,
      email: req.body.email,
      childrens: req.body.childrens,
      phone: req.body.phone,
      birthday: req.body.birthday,
      password_hash,
    });

    return res.json({
      id,
      name,
      email,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(500).json({ error: 'User not found' });
    }

    const { name, email, phone } = user;

    return res.json({
      id,
      name,
      email,
      phone,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
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
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findById(req.userId);

    const { email, oldPassword, password } = req.body;

    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    const oldPasswordMatch = await bcrypt.compare(
      oldPassword,
      user.password_hash
    );

    if (oldPassword && !oldPasswordMatch) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const password_hash = await bcrypt.hash(password, 8);

    req.body.password_hash = password_hash;

    const { id, name } = await User.findByIdAndUpdate(req.userId, req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async destroy(req, res) {
    const { userId } = req;

    await User.findByIdAndDelete(userId);
    await Necessity.deleteMany({ user_id: userId });

    return res.send();
  }
}

export default new UserController();
