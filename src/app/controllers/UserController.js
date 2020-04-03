import * as Yup from 'yup';

import bcrypt from 'bcryptjs';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      childrens: Yup.string().required(),
      phone: Yup.number().required(),
      birthday: Yup.string().required(),
      password: Yup.string().required().min(6),
      confirm_password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
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

    const { email, oldPassword } = req.body;

    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
