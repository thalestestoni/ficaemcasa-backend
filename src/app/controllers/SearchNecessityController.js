import Necessity from '../models/Necessity';

class SearchController {
  async index(req, res) {
    const { latitude, longitude, categories } = req.query;

    const necessity = await Necessity.find({
      necessities: {
        $elemMatch: {
          category: {
            $in: categories,
          },
        },
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });

    return res.json({ necessity });
  }
}

export default new SearchController();
