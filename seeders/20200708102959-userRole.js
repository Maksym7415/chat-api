
let faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [];
    for(let i = 0; i < 25; i++){
      newArray.push({
        fkUserId: faker.random.number({min: 1, max: 10}),
        fkRoleId: faker.random.number({min: 1, max: 25}),
      })
    }
    await queryInterface.bulkInsert('userRole', newArray, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('userRole', null, {});
  }
}