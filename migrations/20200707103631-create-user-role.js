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
        type: Sequelize.INTEGER,
        unique: "fkUserId_fkRoleId_unique",
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
      },
      fkRoleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: "fkUserId_fkRoleId_unique",
        references: {
          model: {
            tableName: 'Role',
            key: 'id',
          },
        },
      },
    },
    {
      uniqueKeys: {
        fkUserId_fkRoleId_unique: {
          customIndex: true,
          fields: ['fkRoleId', 'fkUserId']
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserRole');
  }
};