import * as Yup from 'yup';

import Necessity from '../models/Necessity';

class NecessityController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      necessity_list: Yup.array().required(),
      phone: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fields fails' });
    }

    const location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    };

    const necessity = await Necessity.create({
      name: req.body.name,
      age: req.body.age,
      childrens: req.body.childrens,
      necessities: req.body.necessities,
      phone: req.body.phone,
      attended: req.attended,
      location,
    });

    return res.json(necessity);
  }

  async index(req, res) {
    const necessities = await Necessity.find();

    return res.json(necessities);
  }
}

export default new NecessityController();
