import mongoose from 'mongoose';
import Necessity from '../models/Necessity';

class StatusNecessityController {
  async update(req, res) {
    const { status, categoriesToUpdate } = req.body;
    const { userId } = req;

    if (!status) {
      return res.status(400).json({ error: 'Status não informado' });
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
