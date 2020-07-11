const {User} = require('../../../models');
const handleSendEmail = require('../../helpers/nodeMailer');
const tokenHelper = require('../../helpers/tokensGenerate');
const jwt = require('jsonwebtoken');

module.exports = {
  signUp: async (req, res) => {
    try {
      const { firstName, lastName, login } = req.body;
      const isUser = await User.findOne({ where: { login } });
      if (!isUser) {
        const user = await User.create({
          firstName, lastName, login, status: 'free',
          
        });
        res.json({ data: { email: user.login }, status: 200, message: 'registration successful' });
      }
      res.status(400).json({ status: 400, message: 'such login already used in the system' });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
  signIn: async (req, res) => {
    try {
      const { login } = req.body;

      const verificationCode = Math.floor(Math.random() * 100000);
      const [isUser] = await User.update({ verificationCode }, {
        where: { login },
      });
      if (isUser) {
        try {
          await handleSendEmail(login, `${verificationCode}`);
          res.json({ status: 200, message: 'send you your verification code' });
        } catch (e) {
          res.status(400).json({ status: 400, message: 'some problems with code transfer' });
        }
        res.json({ data: isUser, status: 200, message: 'checkEmail' });
      }
      res.status(400).json({ status: 400, message: 'you need to registrate your account', code: 999 });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
  checkVerificationCode: async (req, res) => {
    try {
      const { verificationCode, login } = req.body;
      const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
      const isUser = await User.findOne({ where: { login, verificationCode } });
      if (isUser) {
        const accessToken = await tokenHelper(login, 'user', 'moz', isUser.id, );
        return res.json({ status: 200, message: 'successful login', data: accessToken });
      }
      res.status(400).json({message: 'there is no such user in the system', status: 400})
    } catch (e) {
      res.status(501).json({message: e})
    }
  },
};
