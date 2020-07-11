'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Device', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        unique: "fkUserId_fkSessionId_unique",
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
        allowNull: false,
      },
      fkSessionId: {
        type: Sequelize.INTEGER,
        unique: "fkUserId_fkSessionId_unique",
        references: {
          model: {
            tableName: 'Session',
            key: 'id',
          },
        },
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.STRING(200),
        allowNull: false
      }
    },{
      uniqueKeys: {
        fkUserId_fkSessionId_unique: {
          customIndex: true,
          fields: ['fkSessionId', 'fkUserId']
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Device');
  }
};