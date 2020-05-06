import mongoose from 'mongoose';

import calculateDistance from '../utils/calculateDistance';

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
      return res.status(400).json({
        error: 'Você ainda não cadastrou categorias em que precisa de ajuda!',
      });
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
          categoriesToHelp: {
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
        $project: {
          userId: 1,
          categoriesToHelp: 1,
          userPhoto: { $arrayElemAt: ['$user_docs.avatar.url', 0] },
          userName: { $arrayElemAt: ['$user_docs.name', 0] },
          userPhone: { $arrayElemAt: ['$user_docs.phone', 0] },
          userCoordinates: {
            $arrayElemAt: ['$user_docs.location.coordinates', 0],
          },
        },
      },
      {
        $project: {
          userId: 1,
          userPhoto: 1,
          userName: 1,
          userPhone: 1,
          categoriesToHelp: 1,
          userCoordinates: 1,
          coordinates: {
            latitude: { $arrayElemAt: ['$userCoordinates', 1] },
            longitude: { $arrayElemAt: ['$userCoordinates', 0] },
          },
        },
      },
      {
        $sort: { userCoordinates: -1 },
      },
    ]);

    const userLocation = { latitude, longitude };

    assists.forEach((it) => {
      it.distance = calculateDistance(userLocation, it.coordinates);
    });

    return res.json(assists);
  }
}

export default new SearchAssistController();
