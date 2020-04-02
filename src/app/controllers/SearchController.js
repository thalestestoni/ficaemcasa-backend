import User from '../models/User';

class SearchController {
  async index(request, response) {
    const { latitude, longitude } = request.query;

    const necessities = await User.find({
      necessities: {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000,
          },
        },
      },
    });

    return response.json({ necessities });
  }
}

export default new SearchController();
