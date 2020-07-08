'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [{
      accessToken: 'token',
    }]
    
    await queryInterface.bulkInsert('session', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('session', null, {});
  }
};
