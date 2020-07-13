module.exports = {
  jwt: {
    secret: 'mystic_token',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '1m',
      },
    },
  },
};