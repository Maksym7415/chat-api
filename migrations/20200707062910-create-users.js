module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      socketId: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
      activityStatus: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      verificationCode: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      userAvatar: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      userCreationTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      userUpdateTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      userLastTimeOnline: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User');
  },
};
