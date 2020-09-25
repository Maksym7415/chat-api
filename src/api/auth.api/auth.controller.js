const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/jwtConfig').jwt;
const { User, Session } = require('../../../models');
const handleSendEmail = require('../../helpers/nodeMailer');
const { tokenHelper } = require('../../helpers/tokensGenerate');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../../services/errorHandling');

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
      next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_IN_USE, 'Login already in use')));
      // res.status(400).json({ message: 'such login already used in the system' });
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
      // next(createError(501, error));
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
          console.log(error);
          next(createError(formErrorObject(MAIN_ERROR_CODES.BAD_REQUEST, 'Verification code was not transfered')));
          // next(createError(400, 'some problems with code transfer'));
        }
      }
      next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'you need to registrate your account')));
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },

  checkVerificationCode: async (req, res, next) => {
    try {
      const { verificationCode, login } = req.body;
      console.log(214324);
      // const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
      const isUser = await User.findOne({ where: { login, verificationCode } });

      if (isUser) {
        const tokens = await tokenHelper(login, 'user', 'crome', isUser.id, isUser.firstName);
        return res.json(tokens);
        // res.json({ message: 'successful login' });
      }
      next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User does not exist in system')));
      // res.status(400).json({ message: 'there is no such user in the system' });
    } catch (error) {
      console.log(error);
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
      // next(createError(501, error));
    }
  },
  refreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    // const browserIndenfication = req.get('User-Agent'); // Тут версия браузера
    let payload;
    try {
      payload = jwt.verify(refreshToken, secret);
      console.log(payload);
      if (payload.type !== 'refresh') {
        next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'Refresh token is missed')));
        return;
        // return next(createError(400, 'Invalid token!'));
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'Refresh token is expired')));
        // return res.status(400).json({ message: 'Refresh token expired!' });
      }
      // if (e instanceof jwt.TokenExpiredError) {
      //   next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'Invalid token')));
      //   // return next(createError(400, 'Invalid token!'));
      // }
    }

    try {
      const token = await Session.findOne({ where: { refreshToken, fkUserId: payload.userId } });
      if (token === null) {
        next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'Tokens not found')));
        // return next(createError(400, 'No one token found'));
      }
      const tokens = await tokenHelper(payload.login, payload.role, 'crome', token.userId, payload.firstName);
      res.status(200).json(tokens);
    } catch (e) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
      // next(createError(501, 'other error!'));
    }
  },
};
