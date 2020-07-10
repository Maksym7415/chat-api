const nodemailer = require("nodemailer");

async function handleSendEmail(to, text) {
   // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    service: 'gmail',
    auth: {
      user: 'mynamesurnamemyname@gmail.com', // generated ethereal user
      pass: 'aA123456!', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Conversation APP', // sender address
    to, // list of receivers
    subject: "Confirmation code", // Subject line
    text, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });
}

module.exports = handleSendEmail
