import User from '../models/User';
import Signup from '../models/Signup';

class TokenValidate {
  async signupToken(req, res) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token not found' });
    }

    const signup = await Signup.findOne({ token });

    if (!signup) {
      return res.status(400).json({ error: 'Token não encontrado' });
    }

    const now = new Date();

    if (now > signup.tokenExpires) {
      return res.status(400).json({
        error:
          'O link para confirmação de senha expirou. Por favor, envie novamente a confirmação!',
      });
    }

    return res.send();
  }

  async userToken(req, res) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Erro na validação, tente clicar novamente no link enviado!',
      });
    }

    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(400).json({
        error:
          'Link de validação expirado, verifique se não foi enviado um novo link de alteração!',
      });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(400).json({
        error:
          'O link para alteração de senha expirou. Por favor, envie novamente a confirmação!',
      });
    }

    return res.send();
  }
}

export default new TokenValidate();
