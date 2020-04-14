import mongoose from 'mongoose';

import User from '../models/User';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class SearchNecessityController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const { userId } = req;

    const user = await User.findById({
      _id: mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const assistCategories = await Assist.find({
      userId: mongoose.Types.ObjectId(userId),
    }).distinct('category');

    if (!assistCategories.length) {
      return res
        .status(400)
        .json({ error: 'Nenhuma categoria cadastrada ainda para ajudar' });
    }

    const necessities = await Necessity.aggregate([
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
            category: { $in: assistCategories },
          },
          spherical: false,
          key: 'userLocation',
        },
      },
      {
        $group: {
          _id: '$category',
          userId: { $first: '$userId' },
          userName: { $first: '$userName' },
          userPhone: { $first: '$userPhone' },
          userDistance: { $first: '$distanceCalculated' },
          category: { $first: '$category' },
          items: {
            $push: {
              _id: '$_id',
              item: '$item',
              quantity: '$quantity',
              unitMeasure: '$unitMeasure',
              status: '$status',
            },
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          userId: { $first: '$userId' },
          userName: { $first: '$userName' },
          userPhone: { $first: '$userPhone' },
          userDistance: { $first: '$userDistance' },
          necessities: {
            $push: {
              category: '$category',
              items: '$items',
            },
          },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    return res.json(necessities);
  }
}

export default new SearchNecessityController();
