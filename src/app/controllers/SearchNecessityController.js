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
          _id: '$userId',
          userId: { $last: '$userId' },
          userName: { $last: '$userName' },
          userPhone: { $last: '$userPhone' },
          userDistance: { $last: '$distanceCalculated' },
          necessities: {
            $push: {
              _id: '$_id',
              category: '$category',
              item: '$item',
              quantity: '$quantity',
              unitMeasure: '$unitMeasure',
              status: '$status',
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
