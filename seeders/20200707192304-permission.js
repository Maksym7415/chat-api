'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [{
      name: 'admin',
      description: 'description',
    }]
    
    await queryInterface.bulkInsert('permission', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permission', null, {});
  }
};
