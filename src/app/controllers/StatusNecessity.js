import Necessity from '../models/Necessity';
import mongoose from 'mongoose';

class StatusNecessity {
  async update(req, res) {
    const { status, category, userId } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status não informado' });
    }

    await Necessity.update(
      {
        userId: mongoose.Types.ObjectId(userId),
        category: category,
      },
      { $set: { status: status } },
      {
        multi: true,
      }
    );
    return res.send();
  }
}

export default new StatusNecessity();
