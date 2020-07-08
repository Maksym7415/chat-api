
let faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [];
    for(let i = 0; i < 10; i++){
      newArray.push({
        login: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        tagName: faker.internet.userName(),
        fullName: faker.internet.userName(),
        status: 'free',
      })
    }
    await queryInterface.bulkInsert('user', newArray, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  }
}