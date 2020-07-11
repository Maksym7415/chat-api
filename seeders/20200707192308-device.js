'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [{
      fkUserId: 1,
      fkSessionId: 1,
      userAgent: 'chrome'
    }]
    
    await queryInterface.bulkInsert('device', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('device', null, {});
  }
};
