import Necessity from '../models/Necessity';

class SearchController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const { categories } = req.body;

    // agrupar resultado por user_id e category

    // const necessity = await Necessity.find({
    //   category: {
    //     $in: categories,
    //   },
    //   location: {
    //     $near: {
    //       $geometry: {
    //         type: 'Point',
    //         coordinates: [longitude, latitude],
    //       },
    //       $maxDistance: 10000,
    //     },
    //   },
    // });

    const necessity = await Necessity.aggregate([
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
      {
        $group: {
          _id: '$user_id',
          category: {
            $addToSet: '$category',
          },
          name: {
            $addToSet: '$name',
          },
        },
      },
    ]);

    return res.json(necessity);
  }
}

export default new SearchController();
