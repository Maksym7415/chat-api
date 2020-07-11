const jwt = require('jsonwebtoken');
const { secret, tokens } = require('../../config/jwtConfig').jwt;
const {Device, Session} = require('../../models')

const tokenHelper = (login, role, userAgent, userId) => {
    try {
      const accessToken = generateAccessToken(login, role, userAgent);
      return updateAccessToken(userId, accessToken, userAgent)
        .then(() => ({
          accessToken,
        }));
    } catch (e) {
      return e;
    }
  };

const generateAccessToken = (login, role, userAgent) => { 
  const payload = {
    role,
    login,
    userAgent,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };
  const accessToken = jwt.sign(payload, secret, options);
return accessToken;
};


const updateAccessToken = async (userId, accessToken, userAgent) => {
    try {
     
    } catch (e) {
      return e;
    }
  };

module.exports = tokenHelper;