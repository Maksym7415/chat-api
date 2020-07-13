const jwt = require('jsonwebtoken');
const { Session } = require('../../../models');
const jwtSecret = require('../../../config/jwtConfig').jwt.secret;


module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const browserIndenfication = req.get('User-Agent');
  if (!authHeader) return res.status(400).json({ message: 'header is not correct' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.type !== 'access') {
      res.status(400).json({ message: 'Invalid token!' });
      return;
    }
    const accessToken = await Session.findOne({where: { id: device.fkSessionId } }) // Чтобы нельзя было зайти под старым токеном
    if (accessToken) {
      req.token = payload;

    } else {
      res.status(400).json({ message: 'Invalid token!' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Token expired' });
    }
  }
  next();
};