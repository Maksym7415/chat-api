const data = require('../DBdata/Message');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   message: 'hello',
    //   fkSenderId: 1,
    //   file: 'file'
    // }]

    await queryInterface.bulkInsert('Message', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Message', null, {});
  },
};
