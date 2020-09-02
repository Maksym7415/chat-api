module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contact', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        unique: 'fkUserId_fkContactId_unique',
        allowNull: false,
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
      },
      fkContactId: {
        type: Sequelize.INTEGER,
        unique: 'fkUserId_fkContactId_unique',
        allowNull: false,
        references: {
          model: {
            tableName: 'User',
            key: 'id',
          },
        },
      },
      pseudonyme: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }, {
      uniqueKeys: {
        fkUserId_fkContactId_unique: {
          customIndex: true,
          fields: ['fkUserId', 'fkContactId'],
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contact');
  },
};
