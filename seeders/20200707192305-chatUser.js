const data = require('../DBdata/ChatUser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   fkUserId: 1,
    //   fkChatId: 1,
    //   fkPermissionId: 1
    // }]

    await queryInterface.bulkInsert('ChatUser', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ChatUser', null, {});
  },
};
