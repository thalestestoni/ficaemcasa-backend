import * as Yup from 'yup';

import Necessity from '../models/Necessity';

class NecessityController {
  async store(req, res) {
    const schema = Yup.object().shape({
      necessity_list: Yup.array().required(),
      name: Yup.string().required(),
      phone: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Failed to validate fields' });
    }

    const location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    };

    const necessity = await Necessity.create({
      necessity_list: req.body.necessity_list,
      name: req.body.name,
      phone: req.body.phone,
      user_id: req.userId,
      location,
    });

    if (!necessity) {
      return res.status(500).json({
        error: 'It was not possible to create the record in the database',
      });
    }

    return res.json(necessity);
  }

  async show(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity not found' });
    }

    return res.json(necessity);
  }

  async index(req, res) {
    const { userId } = req.params;

    const necessity = await Necessity.find({ user_id: userId });

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity or user not found' });
    }

    return res.json(necessity);
  }

  async update(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findByIdAndUpdate(id, req.body);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity not found' });
    }

    return res.json(necessity);
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Necessity.findByIdAndDelete(id);

    return res.send();
  }
}

export default new NecessityController();
