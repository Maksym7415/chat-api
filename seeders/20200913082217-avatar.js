const data = require('../DBdata/Avatar');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('avatar', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('avatar', null, {});
  },
};
