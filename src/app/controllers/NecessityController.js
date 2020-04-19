import * as Yup from 'yup';

import mongoose from 'mongoose';

import Necessity from '../models/Necessity';

class NecessityController {
  async store(req, res) {
    const schema = Yup.object().shape({
      necessities: Yup.array(
        Yup.object({
          category: Yup.string().required(),
          item: Yup.string().required(),
          quantity: Yup.number().required(),
          userId: Yup.string().required(),
          userName: Yup.string().required(),
          userPhone: Yup.string().required(),
        })
      ).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Failed to validate fields' });
    }

    const { necessities } = req.body;

    const necessity = await Necessity.insertMany(necessities);

    return res.json(necessity);
  }

  async show(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity not found' });
    }

    return res.json(necessity);
  }

  async index(req, res) {
    const { userId } = req.params;

    const necessity = await Necessity.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          category: { $first: '$category' },
          items: {
            $push: {
              _id: '$_id',
              item: '$item',
              quantity: '$quantity',
              unitMeasure: '$unitMeasure',
              status: '$status',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity or user not found' });
    }

    return res.json(necessity);
  }

  async update(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity not found' });
    }

    if (String(necessity.userId) !== req.userId) {
      const { status } = req.body;

      if (status) {
        await Necessity.findByIdAndUpdate(id, {
          status,
        });

        return res.send();
      }

      return res
        .status(401)
        .json({ error: "You don't have permission to update this necessity" });
    }

    await necessity.update(req.body);

    const necessityUpdated = await Necessity.findById(id);

    return res.json(necessityUpdated);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity not found' });
    }

    if (String(necessity.userId) !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete this necessity" });
    }

    await necessity.remove();

    return res.send();
  }
}

export default new NecessityController();
