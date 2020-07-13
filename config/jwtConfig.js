module.exports = {
  jwt: {
    secret: 'mystic_token',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '3600h',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '10s',
      },
    },
  },
};
