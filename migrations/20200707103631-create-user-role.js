'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRole', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true,
      },
      fkUserId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
      },
      fkRoleId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Role',
            key: 'id',
          },
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserRole');
  }
};