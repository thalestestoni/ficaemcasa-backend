import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const { token } = req.cookies;

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.log(err);
    console.log(req);
    return res.status(401).json({
      error: 'Erro com o token',
    });
  }
};
