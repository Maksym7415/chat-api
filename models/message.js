module.exports = (sequelize, DataType) => {
  const messageTable = sequelize.define('Message', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataType.TEXT,
      allowNull: false,
    },
    fkSenderId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    messageType: {
      type: DataType.STRING(100),
      allowNull: false,
    },
    sendDate: {
      type: DataType.DATE,
      defaultValue: DataType.NOW,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
  });
  messageTable.associate = (models) => {
    messageTable.hasMany(models.ChatMessage, { foreignKey: { name: 'fkMessageId', allowNull: false }, foreignKeyConstraint: true });
    messageTable.belongsToMany(models.Conversation, {
      foreignKey: { name: 'fkMessageId', allowNull: false }, otherKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatMessage,
    });
  };
  return messageTable;
};
