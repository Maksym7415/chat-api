let faker = require('faker');
const data = require('../DBdata/UserRole');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // let newArray = [{
    //   fkUserId: 1,
    //   fkRoleId: 1
    // }];
    
    await queryInterface.bulkInsert('userRole', data, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('userRole', null, {});
  }
}