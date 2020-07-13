const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models');
const handleSendEmail = require('../../helpers/nodeMailer');
const tokenHelper = require('../../helpers/tokensGenerate');

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { firstName, lastName, login } = req.body;
      const isUser = await User.findOne({ where: { login } });
      if (!isUser) {
        const user = await User.create({
          firstName, lastName, login, status: 'free',

        });
        res.json({ data: { email: user.login }, message: 'registration successful' });
      }
      res.status(400).json({ message: 'such login already used in the system' });
    } catch (error) {
      next(createError(501, error));
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { login } = req.body;

      const verificationCode = Math.floor(Math.random() * 100000);
      const [isUser] = await User.update({ verificationCode }, {
        where: { login },
      });
      if (isUser) {
        try {
          await handleSendEmail(login, `${verificationCode}`);
          res.json('send you your verification code');
        } catch (error) {
          console.log(createError(400, 'some problems with code transfer'));
          next(createError(400, 'some problems with code transfer'));
        }
        res.json({ data: isUser, message: 'checkEmail' });
      }
      next(createError(400, 'you need to registrate your account', { code: 999 }));
    } catch (error) {
      next(createError(501, error));
      // res.status(501).json(error);
    }
  },

  checkVerificationCode: async (req, res, next) => {
    try {
      const { verificationCode, login } = req.body;
      const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
      const isUser = await User.findOne({ where: { login, verificationCode } });
      if (isUser) {
        const accessToken = await tokenHelper(login, 'user', 'moz', isUser.id);
        res.json({ message: 'successful login', data: accessToken });
        // res.json({ message: 'successful login' });
      }
      res.status(400).json({ message: 'there is no such user in the system' });
    } catch (error) {
      next(createError(501, error));
    }
  },
};
