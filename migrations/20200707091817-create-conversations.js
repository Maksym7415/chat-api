module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      conversationName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      conversationType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      conversationAvatar: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      conversationCreationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      conversationUpdateDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversation');
  },
};
