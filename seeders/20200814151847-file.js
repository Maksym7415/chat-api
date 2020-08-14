'use strict';

const data = require('../DBdata/File');

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('file', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('file', null, {});
  }
};
