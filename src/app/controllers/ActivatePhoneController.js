import * as Yup from 'yup';

import Phone from '../models/Phone';
import formatPhone from '../../utils/formatPhone';

class ActivatePhoneController {
  async update(req, res) {
    const schema = Yup.object().shape({
      phone: Yup.string().required(),
      token: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const token = req.body.token.split(' ').join('');
    const phone = formatPhone(req.body.phone);

    const registeredPhone = await Phone.findOne({ phone });

    if (!registeredPhone) {
      return res.status(400).json({ error: 'Telefone não encontrado' });
    }

    if (registeredPhone.activated) {
      return res.status(400).json({ error: 'O telefone já está ativado' });
    }

    const now = new Date();

    if (now > registeredPhone.tokenExpires) {
      return res
        .status(400)
        .json({ error: 'Código de verificação expirou, gere um novo' });
    }

    if (token !== registeredPhone.token) {
      return res.status(400).json({ error: 'Codigo de verificação incorreto' });
    }

    registeredPhone.activated = true;

    registeredPhone.save();

    return res.json({ success: 'Telefone ativado' });
  }
}

export default new ActivatePhoneController();
