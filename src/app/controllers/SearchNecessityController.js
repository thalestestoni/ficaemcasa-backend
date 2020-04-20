import mongoose from 'mongoose';

import calculateDistance from '../utils/calculateDistance';

import User from '../models/User';
import Necessity from '../models/Necessity';
import Assist from '../models/Assist';

class SearchNecessityController {
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

    const assistCategories = await Assist.find({
      userId: mongoose.Types.ObjectId(userId),
    }).distinct('category');

    if (!assistCategories.length) {
      return res
        .status(400)
        .json({ error: 'Nenhuma categoria cadastrada ainda para ajudar' });
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

    const necessities = await Necessity.aggregate([
      {
        $match: {
          userId: { $in: usersAround, $ne: mongoose.Types.ObjectId(userId) },
          category: { $in: assistCategories },
          status: { $in: ['available', 'pending'] },
        },
      },
      {
        $group: {
          _id: { userId: '$userId', category: '$category' },
          userId: { $first: '$userId' },
          userName: { $first: '$userName' },
          userPhone: { $first: '$userPhone' },
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

    necessities.forEach((necessity) => {
      necessity.userCoordinates = {
        latitude: necessity.userCoordinates[0][1],
        longitude: necessity.userCoordinates[0][0],
      };
      necessity.distance = calculateDistance(
        userLocation,
        necessity.userCoordinates
      );
    });

    return res.json(necessities);
  }
}

export default new SearchNecessityController();
