'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true,
      },
      login: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      firstName: {
          type: Sequelize.STRING(45),
          allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      tagName: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      fullName: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User');
  }
};