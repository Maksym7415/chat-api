'use strict';

const data = require('../DBdata/ChatMessage');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = [{
    //   fkChatId: 1,
    //   fkMessageId: 1,
    // }]
    
    await queryInterface.bulkInsert('chatMessage', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('chatMessage', null, {});
  }
};
