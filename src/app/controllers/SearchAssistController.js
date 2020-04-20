import mongoose from 'mongoose';

import calculateDistance from '../utils/calculateDistance';

import User from '../models/User';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class SearchAssistController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const userLocation = { latitude, longitude };

    const { userId } = req;

    const user = await User.findById({
      _id: mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const needyCategories = await Assist.find({
      userId: mongoose.Types.ObjectId(userId),
    }).distinct('category');

    if (!needyCategories.length) {
      return res
        .status(400)
        .json({ error: 'Nenhuma categoria cadastrada ainda' });
    }

    const usersAround = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
      active: true,
    }).distinct('_id');

    const assists = await Assist.aggregate([
      {
        $match: {
          userId: { $in: usersAround, $ne: mongoose.Types.ObjectId(userId) },
          category: { $in: needyCategories },
        },
      },
      {
        $group: {
          _id: '$userId',
          userId: { $first: '$userId' },
          userName: { $first: '$userName' },
          userPhone: { $first: '$userPhone' },
          category: {
            $addToSet: '$category',
          },
        },
      },
      {
        $project: { _id: 0 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user_docs',
        },
      },
      {
        $set: { userCoordinates: '$user_docs.location.coordinates' },
      },
      {
        $project: {
          user_docs: 0,
        },
      },
      {
        $sort: { userCoordinates: 1 },
      },
    ]);

    assists.forEach((necessity) => {
      const location = {
        longitude: necessity.userCoordinates[0][0],
        latitude: necessity.userCoordinates[0][1],
      };
      necessity.calculateDistance = calculateDistance(userLocation, location);
    });

    return res.json(assists);
  }
}

export default new SearchAssistController();
