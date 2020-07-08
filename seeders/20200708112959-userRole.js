
let faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [{
      fkUserId: 1,
      fkRoleId: 1
    }];
    
    await queryInterface.bulkInsert('userRole', newArray, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('userRole', null, {});
  }
}