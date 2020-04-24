import User from '../models/User';

class FileController {
  async store(req, res) {
    const { originalname: name, key, size } = req.file;

    let { location: url = '' } = req.file;

    if (!url) {
      url = `${process.env.APP_URL}/files/${key}`;
    }

    const avatar = {
      avatar: { name, size, key, url },
    };

    await User.findByIdAndUpdate(req.userId, avatar);

    const user = await User.findById(req.userId);

    return res.json({
      avatar: user.avatar.url,
    });
  }
}

export default new FileController();
