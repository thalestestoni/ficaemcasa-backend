import Mail from '../../lib/Mail';

const frontUrl = process.env.FRONT_URL;

class ResetPasswordMail {
  async handle(data) {
    const { user, token } = data;

    const firstName = user.name.split(' ')[0];

    await Mail.sendMail({
      to: `${firstName} <${user.email}>`,
      subject: 'Cadastrar nova senha',
      template: 'resetPassword',
      context: {
        resetPasswordLink: `${frontUrl}/forgot-password/${token}`,
      },
    });
  }
}

export default new ResetPasswordMail();
