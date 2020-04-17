import * as Yup from 'yup';
import mongoose from 'mongoose';

import Assist from '../models/Assist';

class AssistController {
  async store(req, res) {
    const schema = Yup.object().shape({
      category: Yup.string().required(),
      userId: Yup.string().required(),
      userName: Yup.string().required(),
      userPhone: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Failed to validate fields' });
    }

    const categoryExists = await Assist.find({
      userId: mongoose.Types.ObjectId(req.body.userId),
      category: req.body.category,
    });

    if (categoryExists.length) {
      return res.status(400).json({ error: 'Categoria já cadastrada' });
    }

    const createdAssist = await Assist.create(req.body);

    return res.json(createdAssist);
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

    const assistUpdated = await Assist.findById(id);

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
