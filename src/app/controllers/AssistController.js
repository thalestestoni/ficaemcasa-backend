import * as Yup from 'yup';

import Assist from '../models/Assist';

class AssistController {
  async store(req, res) {
    const schema = Yup.object().shape({
      category: Yup.string().required(),
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

    req.body.location = location;
    req.body.user_id = req.userId;

    const { _id, category, note, name, phone } = await Assist.create(req.body);

    return res.json({
      _id,
      category,
      note,
      name,
      phone,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id, {
      _id: 0,
      user_id: 0,
      location: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    if (!assist) {
      return res.status(400).json({ error: 'Assist not found' });
    }

    return res.json(assist);
  }

  async index(req, res) {
    const { userId } = req.params;

    const assist = await Assist.find(
      { user_id: userId },
      {
        user_id: 0,
        location: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );

    if (!assist) {
      return res.status(400).json({ error: 'Assist or user not found' });
    }

    return res.json(assist);
  }

  async update(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id);

    if (!assist) {
      return res.status(400).json({ error: 'Assist not found' });
    }

    if (assist.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to update this assist" });
    }

    await assist.update(req.body);

    const { category, note, name, phone } = await Assist.findById(id);

    return res.json({
      category,
      note,
      name,
      phone,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id);

    if (!assist) {
      return res.status(400).json({ error: 'Assist not found' });
    }

    if (assist.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete this assist" });
    }

    await assist.remove();

    return res.send();
  }
}

export default new AssistController();
