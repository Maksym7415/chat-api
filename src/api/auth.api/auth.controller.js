const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/jwtConfig').jwt;
const { User, Session } = require('../../../models');
const handleSendEmail = require('../../helpers/nodeMailer');
const { tokenHelper } = require('../../helpers/tokensGenerate');

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { firstName, lastName, login } = req.body;
      const isUser = await User.findOne({ where: { login } });
      if (!isUser) {
        const user = await User.create({
          firstName, lastName, login, status: 'free',

        });
        res.json({ email: user.login });
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
      console.log(isUser);
      if (isUser) {
        try {
          await handleSendEmail(login, `${verificationCode}`);
          return res.json('send you your verification code');
        } catch (error) {
          next(createError(400, 'some problems with code transfer'));
        }
      }
      next(createError(400, { message: 'you need to registrate your account', code: 210, obj: {test: 'test'} }));
    } catch (error) {
      next(createError(501, error));
      // res.status(501).json(error);
    }
  },

  checkVerificationCode: async (req, res, next) => {
    try {
      const { verificationCode, login } = req.body;
      // const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
      const isUser = await User.findOne({ where: { login, verificationCode } });

      if (isUser) {
        const tokens = await tokenHelper(login, 'user', 'crome', isUser.id);
        return res.json(tokens);
        // res.json({ message: 'successful login' });
      }
      res.status(400).json({ message: 'there is no such user in the system' });
    } catch (error) {
      next(createError(501, error));
    }
  },
  refreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    // const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
    let payload;
    try {
      payload = jwt.verify(refreshToken, secret);
      if (payload.type !== 'refresh') {
        return next(createError(400, 'Invalid token!'));
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ message: 'Refresh token expired!' });
      } if (e instanceof jwt.TokenExpiredError) {
        return next(createError(400, 'Invalid token!'));
      }
    }

    try {
      const token = await Session.findOne({ where: { refreshToken, fkUserId: payload.userId } });
      if (token === null) {
        return next(createError(400, 'No one token found'));
      }
      const tokens = await tokenHelper(payload.login, payload.role, 'crome', token.userId);
      res.status(200).json(tokens);
    } catch (e) {
      next(createError(501, 'other error!'));
    }
  },
};
