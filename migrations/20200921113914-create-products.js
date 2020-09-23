'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productPrice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unitPrice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      barCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      prodCountry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};