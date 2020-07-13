const jwt = require('jsonwebtoken');
const { secret, tokens } = require('../../config/jwtConfig').jwt;
const {Device, Session} = require('../../models')

const tokenHelper = (login, role, userAgent, userId) => {
    try {
      const accessToken = generateAccessToken(login, role, userAgent, userId);
      return updateAccessToken(userId, accessToken, userAgent)
        .then(() => ({
          accessToken,
        }));
    } catch (e) {
      return e;
    }
  };

const generateAccessToken = (login, role, userAgent, userId) => {
  const payload = {
    role,
    login,
    userAgent,
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };
  const accessToken = jwt.sign(payload, secret, options);
return accessToken;
};


const updateAccessToken = async (userId, accessToken, userAgent) => {
    try {
      const isNewDevice = await Device.findOne({ where: { fkUserId: userId, userAgent } });
      if (!isNewDevice) {
        const session = await Session.create({
            accessToken,
        });
        await Device.create({
            fkUserId: userId,
            fkSessionId: session.id,
            userAgent
        })
      } else {
        await Session.update({
            accessToken
          },
          {
            where: { 
              id: isNewDevice.fkSessionId 
            }
          }
        )
      }
    } catch (e) {
      return e;
    }
  };

module.exports = {
  tokenHelper,
  updateAccessToken,
  generateAccessToken
};