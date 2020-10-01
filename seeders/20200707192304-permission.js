const data = require('../DBdata/Permission');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   name: 'admin',
    //   description: 'description',
    // }]

    await queryInterface.bulkInsert('Permission', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Permission', null, {});
  },
};
