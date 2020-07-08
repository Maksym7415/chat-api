'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [{
      fkUserId: 1,
      fkChatId: 1,
      fkPermissionId: 1
    }]
    
    await queryInterface.bulkInsert('chatUser', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('chatUser', null, {});
  }
};
