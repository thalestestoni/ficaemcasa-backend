import * as Yup from 'yup';
import mongoose from 'mongoose';

import Assist from '../models/Assist';

class AssistController {
  async store(req, res) {
    const schema = Yup.object().shape({
      category: Yup.string().required(),
      userName: Yup.string().required(),
      userPhone: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const categoryExists = await Assist.find({
      userId: mongoose.Types.ObjectId(req.userId),
      category: req.body.category,
    });

    if (categoryExists.length) {
      return res.status(400).json({ error: 'Categoria já cadastrada' });
    }

    req.body.userId = req.userId;

    const createdAssist = await Assist.create(req.body);

    return res.json(createdAssist);
  }

  async show(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    if (!assist) {
      return res.status(400).json({ error: 'Ajuda não encontrada' });
    }

    return res.json(assist);
  }

  async index(req, res) {
    const userId = req.userId;

    const assist = await Assist.find(
      { userId },
      {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );

    if (!assist) {
      return res
        .status(400)
        .json({ error: 'Nenhuma ajuda encontrada deste este usuário' });
    }

    return res.json(assist);
  }

  async update(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id);

    if (!assist) {
      return res.status(400).json({ error: 'Ajuda não encontrada' });
    }

    if (String(assist.userId) !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para atualizar esta ajuda' });
    }

    await assist.update(req.body);

    const assistUpdated = await Assist.findById(id);

    return res.json(assistUpdated);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const assist = await Assist.findById(id);

    if (!assist) {
      return res.status(400).json({ error: 'Ajuda não encontrada' });
    }

    if (String(assist.userId) !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para atualizar esta ajuda' });
    }

    await assist.remove();

    return res.send();
  }
}

export default new AssistController();
