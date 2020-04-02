import Necessity from '../models/Necessity';

class SearchController {
  async index(request, response) {
    const { latitude, longitude } = request.query;

    const necessity = await Necessity.find({
      necessity: {
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

    return response.json({ necessity });
  }
}

export default new SearchController();
