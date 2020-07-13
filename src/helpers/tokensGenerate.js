/* eslint-disable no-use-before-define */
const jwt = require('jsonwebtoken');
const { secret, tokens } = require('../../config/jwtConfig').jwt;
const { Session } = require('../../models');

const tokenHelper = (login, role, userAgent, userId) => {
  try {
    const accessToken = generateAccessToken(login, role, userAgent, userId);
    const refreshToken = generateRefreshToken(login, role, userAgent, userId);
    return updateAccessToken({
      userId, accessToken, userAgent, refreshToken,
    })
      .then(() => ({
        accessToken,
        refreshToken,
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

const generateRefreshToken = (login, role, userAgent, userId) => {
  const payload = {
    login,
    role,
    userAgent,
    userId,
    type: tokens.refresh.type,
  };
  const options = { expiresIn: tokens.refresh.expiresIn };
  const refreshToken = jwt.sign(payload, secret, options);
  return refreshToken;
};

const updateAccessToken = async ({
  userId, accessToken, userAgent, refreshToken,
}) => {
  try {
    const isNewSession = await Session.findOne({ where: { fkUserId: userId, userAgent } });
    if (!isNewSession) {
      await Session.create({
        accessToken,
        refreshToken,
        userAgent,
        fkUserId: userId,
      });
    } else {
      await Session.update({
        accessToken,
        refreshToken,
      },
      {
        where: {
          fkUserId: userId,
          userAgent,
        },
      });
    }
  } catch (e) {
    return e;
  }
};

module.exports = tokenHelper;
