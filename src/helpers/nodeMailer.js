const nodemailer = require('nodemailer');

async function handleSendEmail(to, text) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
      user: 'm.popov@telesens.ua',
      pass: 'Tunrajaj!',
      // user: 'mynamesurnamemyname@gmail.com',
      // pass: 'aA123456!',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: 'Conversation APP',
    to,
    subject: 'Confirmation code',
    text,
  });
}

module.exports = handleSendEmail;
