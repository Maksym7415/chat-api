const nodemailer = require('nodemailer');

async function handleSendEmail(to, text) {
  let transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
      // user: 'm.popov@telesens.ua',
      // pass: 'Tunrajaj!',
      user: 'mynamesurnamemyname@gmail.com',
      pass: 'aA123456!',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    await transporter.sendMail({
      from: 'Conversation APP',
      to,
      subject: 'Confirmation code',
      text,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleSendEmail;
