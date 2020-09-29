'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        unique: 'fkUserId__unique',
        allowNull: false,
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
      },
      subscription: {
        type: Sequelize.STRING(500)
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subscriptions');
  }
};