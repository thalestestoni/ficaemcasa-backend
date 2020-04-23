import * as Yup from 'yup';
import mongoose from 'mongoose';
import toTitleCase from 'to-title-case';

import Necessity from '../models/Necessity';

class NecessityController {
  async store(req, res) {
    const schema = Yup.object().shape({
      necessities: Yup.array(
        Yup.object({
          category: Yup.string().required(),
          item: Yup.string().required(),
          quantity: Yup.number().required(),
          measureUnit: Yup.string().required(),
          userName: Yup.string().required(),
          userPhone: Yup.string().required(),
        })
      ).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const { necessities } = req.body;

    necessities.forEach((it) => {
      it.userId = req.userId;
      it.userName = toTitleCase(it.userName);
    });

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
      return res.status(400).json({ error: 'Necessidade não encontrada' });
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
              measureUnit: '$measureUnit',
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
      return res.status(400).json({ error: 'Necessidade não encontrada' });
    }

    return res.json(necessity);
  }

  async update(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessidade não encontrada' });
    }

    if (String(necessity.userId) !== req.userId) {
      return res.status(401).json({
        error: 'Você não tem permissão para atualizar esta necessidade',
      });
    }

    await necessity.update(req.body);

    const necessityUpdated = await Necessity.findById(id);

    return res.json(necessityUpdated);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessidade não encontrada' });
    }

    if (String(necessity.userId) !== req.userId) {
      return res.status(401).json({
        error: 'Você não tem permissão para remover esta necessidade',
      });
    }

    await necessity.remove();

    return res.send();
  }
}

export default new NecessityController();
