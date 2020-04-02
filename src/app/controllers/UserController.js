import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async post(req, res) {
    console.log(req.body);
    const user = await User.create({
      name: req.body.name,
      age: req.body.age,
      childrensNumber: req.body.childrensNumber,
      necessities: req.body.necessities,
      phone: req.body.phone,
      password: req.body.password,
    });

    return res.json(user);
  }

  async patch(req, res) {
    const necessities = req.body;
    console.log(necessities);
    await User.updateMany({}, { necessities: necessities });
    return res.status(200);
  }

  async index(req, res) {
    const users = await User.find({});
    return res.json(users);
  }
}

export default new UserController();
