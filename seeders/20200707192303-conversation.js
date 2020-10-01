const data = require('../DBdata/Conversation');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   chatType: 'single'
    // }]

    await queryInterface.bulkInsert('Conversation', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Conversation', null, {});
  },
};
