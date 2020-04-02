import * as Yup from 'yup';

import Necessity from '../models/Necessity';

class NecessityController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      necessity: Yup.array().required(),
      attended: Yup.bool().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fields fails' });
    }

    const location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    };

    const necessity = await Necessity.create({
      user_id: req.body.user_id,
      name: req.body.name,
      necessity: req.body.necessities,
      attended: req.attended,
      location,
    });

    if (!necessity) {
      return res.status(500).json({
        error: 'It was not possible to create the record in the database',
      });
    }

    return res.json(necessity);
  }
}

export default new NecessityController();
