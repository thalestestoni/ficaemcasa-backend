import Necessity from '../models/Necessity';

class CategoryController {
  async destroy(req, res) {
    const { category } = req.body;

    await Necessity.deleteMany({
      category,
      userId: req.userId,
    });

    return res.send();
  }
}

export default new CategoryController();
