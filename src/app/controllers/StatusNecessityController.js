import mongoose from 'mongoose';
import * as Yup from 'yup';

import Necessity from '../models/Necessity';

class StatusNecessityController {
  async update(req, res) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
      categoriesToUpdate: Yup.array().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const { status, categoriesToUpdate } = req.body;

    let { userId } = req.body;

    if (!userId) {
      userId = req.userId;
    }

    await Necessity.update(
      {
        userId: mongoose.Types.ObjectId(userId),
        category: { $in: categoriesToUpdate },
      },
      { $set: { status } },
      {
        multi: true,
      }
    );
    return res.send();
  }

  async index(req, res) {
    const { userId } = req;

    const necessities = await Necessity.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          status: 'pending',
        },
      },
      {
        $group: {
          _id: '$category',
          category: { $first: '$category' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return res.json(necessities);
  }
}

export default new StatusNecessityController();
