const data = require('../DBdata/Message');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   message: 'hello',
    //   fkSenderId: 1,
    //   file: 'file'
    // }]

    await queryInterface.bulkInsert('message', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('message', null, {});
  },
};
