'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Session', {
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
        allowNull: false,
      },
      accessToken: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      userAgent: {
        type: Sequelize.STRING(200),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Session');
  }
};