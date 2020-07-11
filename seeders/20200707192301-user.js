let faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [];
    // for(let i = 0; i < 10; i++){
    //   newArray.push({
    //     login: faker.internet.userName(),
    //     firstName: faker.name.firstName(),
    //     lastName: faker.name.lastName(),
    //     tagName: faker.internet.userName(),
    //     fullName: faker.internet.userName(),
    //     status: 'free',
    //   })
    // }
    newArray.push({
      login: 'Kasandra_Cronin',
      firstName: 'Arnold',
      lastName: 'Bailey',
      tagName: 'Monte_Waelchi',
      fullName: 'Jeffry_Leuschke76',
      status: 'free',
      verificationCode: '35234',
    });
    // const array = JSON.parse(newArray[0])
    // console.log(array)
    await queryInterface.bulkInsert('user', newArray, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  },
};
