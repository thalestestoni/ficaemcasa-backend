import * as Yup from 'yup';

import Necessity from '../models/Necessity';

class NecessityController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      age: Yup.number().required(),
      childrens: Yup.number().required(),
      necessity: Yup.string().required(),
      phone: Yup.string().required(),
      attended: Yup.bool().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fields fails' });
    }

    const necessity = await Necessity.create({
      name: req.body.name,
      age: req.body.age,
      childrens: req.body.childrens,
      necessity: req.body.necessity,
      phone: req.body.phone,
      attended: req.body.attended,
    });

    return res.json(necessity);
  }
}

export default new NecessityController();
