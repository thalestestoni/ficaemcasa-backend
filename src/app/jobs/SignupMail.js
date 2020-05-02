import Mail from '../../lib/Mail';

const frontUrl = process.env.FRONT_URL;

class SignupMail {
  async handle(data) {
    const { email, token } = data;

    await Mail.sendMail({
      to: `<${email}>`,
      subject: 'Confirmação de email',
      template: 'signup',
      context: {
        signupLink: `${frontUrl}/second-signup/${token}/email`,
      },
    });
  }
}

export default new SignupMail();
