const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { Session } = require('../../../models');
const jwtSecret = require('../../../config/jwtConfig').jwt.secret;

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const browserIndenfication = req.get('User-Agent');

  if (!authHeader) next(createError(400, 'header is not correct'));

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.type !== 'access') {
      next(createError(400, 'Invalid token!'));
    }
    const accessToken = await Session.findOne({ where: { fkUserId: payload.userId, userAgent: browserIndenfication } }); // Чтобы нельзя было зайти под старым токеном
    if (accessToken) {
      req.token = payload;
    } else {
      next(createError(400, 'Invalid token!'));
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      next(createError(400, 'Token expired!'));
    }
    if (e instanceof jwt.JsonWebTokenError) {
      next(createError(400, 'Invalid token!'));
    }
  }
  next();
};
