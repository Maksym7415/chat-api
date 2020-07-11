module.exports = (sequelize, DataType) => {
  const chatMessageTable = sequelize.define('ChatMessage', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fkChatId: {
      type: DataType.INTEGER,
    },
    fkMessageId: {
      type: DataType.INTEGER,
    },
  }, {
    freezeTableName: true,
    indexes: [
      {
          unique: true,
          fields: ['fkChatId', 'fkMessageId']
      }
    ],
  });
  chatMessageTable.associate = (models) => {
    chatMessageTable.belongsTo(models.Conversation, { foreignKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true });
    chatMessageTable.belongsTo(models.Message, { foreignKey: { name: 'fkMessageId', allowNull: false }, foreignKeyConstraint: true });
  };
  return chatMessageTable;
};
