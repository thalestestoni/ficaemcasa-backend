import Mail from '../../lib/Mail';

const frontUrl = process.env.FRONT_URL;

class ResetPasswordMail {
  async handle(data) {
    const { user, token } = data;

    const firstName = user.name.split(' ').slice(0, 1).join(' ');

    await Mail.sendMail({
      to: `${firstName} <${user.email}>`,
      subject: 'Recuperação de Senha',
      template: 'resetPassword',
      context: {
        userName: firstName,
        resetPasswordLink: `${frontUrl}/second-signup/${token}/email`,
      },
    });
  }
}

export default new ResetPasswordMail();
