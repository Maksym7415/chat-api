module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('File', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fileStorageName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      fileUserName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      extension: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      fkMessageId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Message',
            key: 'id',
          },
        },
        onDelete: 'CASCADE',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('File');
  },
};
