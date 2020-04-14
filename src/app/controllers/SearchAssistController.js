import mongoose from 'mongoose';

import User from '../models/User';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class SearchAssistController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const { userId } = req;

    const user = await User.findById({
      _id: mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const needyCategories = await Necessity.find({
      userId: mongoose.Types.ObjectId(userId),
    }).distinct('category');

    if (!needyCategories.length) {
      return res
        .status(400)
        .json({ error: 'Nenhuma categoria cadastrada ainda' });
    }

    const assists = await Assist.aggregate([
      {
        $geoNear: {
          near: {
            $geometry: {
              type: 'Point',
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
          distanceField: 'distanceCalculated',
          query: {
            userId: { $ne: mongoose.Types.ObjectId(userId) },
            category: { $in: needyCategories },
          },
          spherical: false,
          key: 'userLocation',
        },
      },
      {
        $group: {
          _id: '$userId',
          userId: { $first: '$userId' },
          userName: { $first: '$userName' },
          userPhone: { $first: '$userPhone' },
          userDistance: { $first: '$distanceCalculated' },
          category: {
            $addToSet: '$category',
          },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    return res.json(assists);
  }
}

export default new SearchAssistController();
