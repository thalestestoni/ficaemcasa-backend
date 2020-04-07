import Assist from '../models/Assist';

class SearchController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const { categories } = req.body;

    const assist = await Assist.find({
      assists: {
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

    return res.json({ assist });
  }
}

export default new SearchController();
