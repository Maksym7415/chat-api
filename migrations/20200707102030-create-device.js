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
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
      },
      fkSesionId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Session',
            key: 'id',
          },
        },
      },
      userAgent: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Device');
  }
};