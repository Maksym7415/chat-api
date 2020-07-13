'use strict';

const data = require('../DBdata/Contact');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   fkUserId: 1,
    //   fkContactId: 1,
    //   pseudonyme: 'pseudonyme',
    //   type: 'type'
    // }]
    
    await queryInterface.bulkInsert('contact', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contact', null, {});
  }
};
