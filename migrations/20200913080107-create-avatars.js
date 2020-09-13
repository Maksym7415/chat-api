module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Avatar', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fileName: {
        allowNull: false,
        type: Sequelize.STRING(200),
      },
      defaultAvatar: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Avatar');
  },
};
