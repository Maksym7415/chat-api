const models = require('../../../models');
const handleSendEmail = require('../../helpers/nodeMailer');

module.exports = {
  signUp: async (req, res) => {
    try {
      const { firstName, lastName, login } = req.body;
      const isUser = await models.User.findOne({ where: { login } });
      if (!isUser) {
        const newUser = await models.User.create({
          firstName, lastName, login, status: 'free',
        });
        res.json({ data: { email: newUser.login }, status: 200, message: 'registration successful' });
      }
      res.json({ status: 400, message: 'such login already used in the system' });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
  signIn: async (req, res) => {
    try {
      const { login } = req.body;

      const verificationCode = Math.floor(Math.random() * 100000);
      const [isUser] = await models.User.update({ verificationCode }, {
        where: { login },
      });
      console.log(login, verificationCode, isUser);
      if (isUser) {
        try {
          await handleSendEmail(login, `${verificationCode}`);
          res.json({ status: 200, message: 'send you your verification code' });
        } catch (e) {
          res.json({ status: 400, message: 'some problems with code transfer' });
        }
        res.json({ data: isUser, status: 200, message: 'checkEmail' });
      }
      res.json({ status: 400, message: 'you need to registrate your account', code: 999 });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
  sendCheckCode: async (req, res) => {
    try {
      const { verificationCode, login } = req.body;
      const isSuccess = await models.User.findOne({ where: { login, verificationCode } });
      console.log(isSuccess);
      if (isSuccess) {
        return res.json({ status: 200, message: 'successful login' });
      }
      return res.json({ status: 400, message: 'there is no such user in the system' });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
};
