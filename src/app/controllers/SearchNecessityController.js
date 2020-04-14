import Necessity from '../models/Necessity';

class SearchController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const { categories } = req.body;

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
          query: { category: { $in: categories } },
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

export default new SearchController();
