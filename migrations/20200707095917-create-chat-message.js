module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatMessage', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fkChatId: {
        type: Sequelize.INTEGER,
        unique: 'fkChatId_fkMessageId_unique',
        references: {
          model: {
            tableName: 'Conversation',
            key: 'id',
          },
        },
        allowNull: false,
      },
      fkMessageId: {
        type: Sequelize.INTEGER,
        unique: 'fkChatId_fkMessageId_unique',
        references: {
          model: {
            tableName: 'Message',
            key: 'id',
          },
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
    }, {
      uniqueKeys: {
        fkChatId_fkMessageId_unique: {
          customIndex: true,
          fields: ['fkChatId', 'fkMessageId'],
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatMessage');
  },
};
