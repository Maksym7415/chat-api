'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatMessage', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fkChatId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Conversation',
            key: 'id',
          },
        },
      },
      fkMessageId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Message',
            key: 'id',
          },
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatMessage');
  }
};