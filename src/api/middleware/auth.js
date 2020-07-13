const jwt = require('jsonwebtoken');
const { Device, Session } = require('../../../models');
const jwtSecret = require('../../../config/jwtConfig').jwt.secret;

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const browserIndenfication = req.get('User-Agent');
  if (!authHeader) res.status(401).json({ message: 'header is not correct' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.type !== 'access') {
      res.status(401).json({ message: 'Invalid token!' });
      return;
    }
    const device = await Device.findOne({ where: { fkUserId: payload.userId, userAgent: browserIndenfication } });
    const accessToken = await Session.findOne({ where: { id: device.fkSessionId } }); // Чтобы нельзя было зайти под старым токеном
    if (accessToken) {
      req.token = payload;
    } else {
      res.status(401).json({ message: 'Invalid token!' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token expired' });
    }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
  next();
};
