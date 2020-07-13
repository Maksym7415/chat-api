const data = require('../DBdata/Session');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   accessToken: 'token',
    //   fkUserId: 1,
    //   refreshToken: 'refresh_token',
    //   userAgent: 'crome',
    // }];

    await queryInterface.bulkInsert('session', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('session', null, {});
  },
};
