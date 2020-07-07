'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatUser', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: 'User',
            key: 'idUser',
          },
        },
        allowNull: false,
      },
      fkChatId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: {
            tableName: 'Conversation',
            key: 'id',
          },
        },
        allowNull: false,
      },
      fkPermissionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: {
            tableName: 'Permission',
            key: 'id',
          },
        },
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatUser');
  }
};