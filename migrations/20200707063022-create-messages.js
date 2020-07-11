'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Message', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true,
      },
      fkSenderId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
        allowNull: false,
      },
      message: {
          type: Sequelize.TEXT,
          allowNull: false,
      },
      file: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Message');
  }
};