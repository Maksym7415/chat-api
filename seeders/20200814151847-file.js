const data = require('../DBdata/File');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('File', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('File', null, {});
  },
};
