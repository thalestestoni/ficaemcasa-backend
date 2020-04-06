import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password does not match' });
      }
      const { id, adress, name, phone, age } = user;

      const token = jwt.sign(user.id, authConfig.secret);
      return res.status(200).json({
        user: {
          id,
          name,
          adress,
          phone,
          birthday,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new SessionController();
