const jwt = require('jsonwebtoken');
const { Session } = require('../../../models');
const jwtSecret = require('../../../config/jwtConfig').jwt.secret;

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const browserIndenfication = req.get('User-Agent');
  if (!authHeader) return res.status(400).json({ code: 400, message: 'Header is not recognized' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.type !== 'access') {
      res.status(400).json({ code: 400, message: 'There is should be access token' });
      return;
    }
    const isSession = await Session.findOne({ where: { fkUserId: payload.userId, userAgent: 'crome' } }); // для тест окружения

    // const isSession = await Session.findOne({ where: { fkUserId: payload.userId, accessToken: token, userAgent: 'crome' } }); // Чтобы нельзя было зайти под старым токеном
    if (isSession) {
      req.token = payload;
    } else {
      res.status(400).json({ code: 400, message: 'System does not recognized tis token' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ code: 400, message: 'Time of token is expired' });
    }
  }
  next();
};
