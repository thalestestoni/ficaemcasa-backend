import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      age: Yup.number().required(),
      childrens: Yup.number().required(),
      necessities: Yup.array().notRequired(),
      phone: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fields fails' });
    }

    const user = await User.create({
      name: req.body.name,
      age: req.body.age,
      childrens: req.body.childrens,
      necessities: req.body.necessities,
      phone: req.body.phone,
      location,
    });

    return res.json(user);
  }

  async index(req, res) {
    const necessities = await Necessity.find();

    return res.json(necessities);
  }
}

export default UserController;
