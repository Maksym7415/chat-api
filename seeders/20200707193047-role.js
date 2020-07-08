
let faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [];
    for(let i = 0; i < 25; i++){
      newArray.push({
        name: faker.name.jobTitle(),
        description: faker.lorem.word(),
      })
    }
    await queryInterface.bulkInsert('role', newArray, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', null, {});
  }
}