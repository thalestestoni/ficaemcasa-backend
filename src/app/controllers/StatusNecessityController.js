import mongoose from 'mongoose';
import * as Yup from 'yup';

import Necessity from '../models/Necessity';
import User from '../models/User';

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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const lastNotification = user.lastNotificationPendingCategories;

    const now = new Date();

    if (
      now.getDate() !== lastNotification.getDate() ||
      now.getMonth() !== lastNotification.getMonth()
    ) {
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

      user.lastNotificationPendingCategories = new Date();
      user.save();

      return res.json(necessities);
    }

    const necessities = [];

    return res.json(necessities);
  }
}

export default new StatusNecessityController();
