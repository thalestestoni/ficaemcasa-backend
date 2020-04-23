import * as Yup from 'yup';

import formatPhone from '../utils/formatPhone';
import isEmail from '../utils/isEmail';
import isPhone from '../utils/isPhone';

import Login from '../models/Login';

class ActivateLoginController {
  async update(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      token: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha ao validar os campos necessários' });
    }

    const token = req.body.token.split(' ').join('');

    const { login } = req.body;

    if (isEmail(login)) {
      const email = login;

      const registeredEmail = await Login.findOne({ login: email });

      if (!registeredEmail) {
        return res.status(400).json({ error: 'Email não encontrado' });
      }

      if (registeredEmail.activated) {
        return res.status(400).json({ error: 'O email já está ativado' });
      }

      const now = new Date();

      if (now > registeredEmail.tokenExpires) {
        return res
          .status(400)
          .json({ error: 'Código de verificação expirou, gere um novo' });
      }

      if (token !== registeredEmail.token) {
        return res
          .status(400)
          .json({ error: 'Codigo de verificação incorreto' });
      }

      registeredEmail.activated = true;

      registeredEmail.save();

      return res.json({ success: 'Email ativado' });
    }

    if (isPhone(login)) {
      const phone = formatPhone(login);

      const registeredPhone = await Login.findOne({ login: phone });

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
        return res
          .status(400)
          .json({ error: 'Codigo de verificação incorreto' });
      }

      registeredPhone.activated = true;

      registeredPhone.save();

      return res.json({ success: 'Telefone ativado' });
    }

    return res.status(400).json({ error: 'Não foi possível validar o login' });
  }
}

export default new ActivateLoginController();
