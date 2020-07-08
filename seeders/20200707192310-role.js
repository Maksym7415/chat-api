let faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [{
      name: 'Admin',
      description: 'Admin'
    }];

    await queryInterface.bulkInsert('role', newArray, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', null, {});
  }
}