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
        unique: "fkUserId_fkChatId_fkPermissionId_unique",
        allowNull: false,
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
        allowNull: false,
      },
      fkChatId: {
        type: Sequelize.INTEGER,
        unique: "fkUserId_fkChatId_fkPermissionId_unique",
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
        unique: "fkUserId_fkChatId_fkPermissionId_unique",
        references: {
          model: {
            tableName: 'Permission',
            key: 'id',
          },
        },
        allowNull: false,
      },
      
    },
    {
        uniqueKeys: {
          fkUserId_fkChatId_fkPermissionId_unique: {
            customIndex: true,
            fields: ['fkUserId', 'fkChatId', 'fkPermissionId']
        }
      }
    });
    
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatUser');
  }
};