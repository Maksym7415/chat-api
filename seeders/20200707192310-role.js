let faker = require('faker');
const data = require('../DBdata/Role');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // let newArray = [{
    //   name: 'Admin',
    //   description: 'Admin'
    // }];

    await queryInterface.bulkInsert('role', data, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', null, {});
  }
}