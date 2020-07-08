'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [{
      chatType: 'single'
    }]
    
    await queryInterface.bulkInsert('conversation', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('conversation', null, {});
  }
};
