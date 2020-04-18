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
    }).distinct('_id');

    if (!usersAround.length) {
      return res.json({
        info:
          'Poxa, não achamos usuário ao seu redor, ' +
          'mas não desanime. Novas pessoas podem aparecer a qualquer momento' +
          ' e você será avisado(a)!',
      });
    }

    const necessities = await Necessity.aggregate([
      {
        $match: {
          userId: { $in: usersAround, $ne: mongoose.Types.ObjectId(userId) },
          category: { $in: assistCategories },
        },
      },
      {
        $group: {
          _id: '$category',
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
    ]);

    if (!necessities.length) {
      return res.json({
        info:
          'Poxa, não achamos alguém que você possa ajudar nessas categorias, ' +
          'mas não desanime. Novas pessoas podem aparecer a qualquer momento' +
          ' e você será avisado(a)!',
      });
    }

    return res.json(necessities);
  }
}

export default new SearchNecessityController();
