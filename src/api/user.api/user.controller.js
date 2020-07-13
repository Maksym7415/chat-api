const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/jwtConfig').jwt;
const { User, Session } = require('../../../models');
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
      // const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
      const isUser = await User.findOne({ where: { login, verificationCode } });
      // const session = await Session.update({
      //   accessToken: '21314234234345',
      //   refreshToken: '2cbdf54',
      // },
      // {
      //   where: {
      //     fkUserId: 1,
      //     userAgent: 'crome',
      //   },
      // });

      if (isUser) {
        const tokens = await tokenHelper(login, 'user', 'crome', isUser.id);
        res.json({ message: 'successful login', data: tokens });
        // res.json({ message: 'successful login' });
      }
      res.status(400).json({ message: 'there is no such user in the system' });
    } catch (error) {
      next(createError(501, error));
    }
  },
  generateNewTokens: async (req, res, next) => {
    const { refreshToken } = req.body;
    // const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
    let payload;
    try {
      try {
        payload = jwt.verify(refreshToken, secret);
        if (payload.type !== 'refresh') {
          next(createError(400, 'Invalid token!'));
        }
      } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
          res.status(400).json({ message: 'Refresh token expired!' });
        } else if (e instanceof jwt.TokenExpiredError) {
          next(createError(400, 'Invalid token!'));
        }
      }
      const token = await Session.findOne({ where: { refreshToken, fkUserId: payload.userId } });
      if (token === null) {
        next(createError(400, 'No one token found'));
      }
      const tokens = await tokenHelper(payload.login, payload.role, 'crome', token.userId);
      res.status(200).json({ data: tokens });
    } catch (e) {
      next(createError(501, 'other error!'));
    }
  },
};
