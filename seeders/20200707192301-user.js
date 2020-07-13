let faker = require('faker');
const data = require('../DBdata/User');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // console.log(JSON.parse(data));
    // let newArray = [{
    //   login: 'popovmaksim7415@gmail.com',
    //   firstName: 'Maksym',
    //   lastName: 'Bailey',
    //   tagName: 'Monte_Waelchi',
    //   fullName: 'Jeffry_Leuschke76',
    //   status: 'free',
    //   verificationCode: '12345',
    // }];
    await queryInterface.bulkInsert('user', data, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  },
};
