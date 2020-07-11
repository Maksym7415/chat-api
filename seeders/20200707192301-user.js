let faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let newArray = [{
      login: 'popovmaksim7415@gmail.com',
      firstName: 'Maksym',
      lastName: 'Bailey',
      tagName: 'Monte_Waelchi',
      fullName: 'Jeffry_Leuschke76',
      status: 'free',
      verificationCode: '12345',
    }];
    await queryInterface.bulkInsert('user', newArray, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  },
};
