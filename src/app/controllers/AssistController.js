import * as Yup from 'yup';

import Assist from '../models/Assist';

class AssistController {
  async store(req, res) {
    const schema = Yup.object().shape({
      assists: Yup.array().required(),
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

    const assist = await Assist.create({
      assists: req.body.assists,
      name: req.body.name,
      phone: req.body.phone,
      user_id: req.userId,
      location,
    });

    return res.json(assist);
  }

  async show(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id);

    if (!assist) {
      return res.status(400).json({ error: 'Assist not found' });
    }

    return res.json(assist);
  }

  async index(req, res) {
    const { userId } = req.params;

    const assist = await Assist.find({ user_id: userId });

    if (!assist) {
      return res.status(400).json({ error: 'Assist or user not found' });
    }

    return res.json(assist);
  }

  async update(req, res) {
    const { id } = req.params;

    const assist = await Assist.findByIdAndUpdate(id, req.body);

    if (!assist) {
      return res.status(400).json({ error: 'Assist not found' });
    }

    return res.json(assist);
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Assist.findByIdAndDelete(id);

    return res.send();
  }
}

export default new AssistController();
