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
}

export default new UserController();
