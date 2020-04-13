import * as Yup from 'yup';

import Assist from '../models/Assist';

class AssistController {
  async store(req, res) {
    const schema = Yup.object().shape({
      assists: Yup.array(
        Yup.object({
          category: Yup.string().required(),
          note: Yup.string(),
          userId: Yup.string().required(),
          userName: Yup.string().required(),
          userPhone: Yup.string().required(),
          longitude: Yup.number().required(),
          latitude: Yup.number().required(),
        })
      ).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Failed to validate fields' });
    }

    const { assists } = req.body;

    assists.forEach((assist) => {
      const location = {
        type: 'Point',
        coordinates: [assist.longitude, assist.latitude],
      };
      assist.userLocation = location;
    });

    const assist = await Assist.insertMany(assists);

    return res.json(assist);
  }

  async show(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id, {
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
      { userId },
      {
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

    if (String(assist.userId) !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to update this assist" });
    }

    await assist.update(req.body);

    const assistUpdated = await Assist.findById(id, {
      userLocation: 0,
      __v: 0,
    });

    return res.json(assistUpdated);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id);

    if (!assist) {
      return res.status(400).json({ error: 'Assist not found' });
    }

    if (String(assist.userId) !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete this assist" });
    }

    await assist.remove();

    return res.send();
  }
}

export default new AssistController();
