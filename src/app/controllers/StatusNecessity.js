import mongoose from 'mongoose';
import Necessity from '../models/Necessity';

class StatusNecessityController {
  async update(req, res) {
    const { status, category, userId } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status não informado' });
    }

    await Necessity.update(
      {
        userId: mongoose.Types.ObjectId(userId),
        category,
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
          items: {
            $push: {
              _id: '$_id',
              item: '$item',
              quantity: '$quantity',
              measureUnit: '$measureUnit',
              status: '$status',
            },
          },
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
