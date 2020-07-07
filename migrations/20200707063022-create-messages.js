'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Message', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true,
      },
      idSender: {
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
          type: Sequelize.STRING(1000),
          allowNull: true,
      },
      file: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Message');
  }
};