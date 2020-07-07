
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
    // await queryInterface.bulkInsert('users', new Array(25).map((el) => ({
    //   login: faker.internet.userName(),
    //   password: faker.internet.password(),
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // })), {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', null, {});
  }
}