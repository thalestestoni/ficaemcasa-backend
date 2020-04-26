import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
      logger: true,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail(
      {
        ...mailConfig.default,
        ...message,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      }
    );
  }
}

export default new Mail();
