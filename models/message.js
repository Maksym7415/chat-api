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
    sendDate: {
      type: DataType.DATE,
      defaultValue: DataType.NOW,
      allowNull: false,
    },
    sendDateMs: {
      type: DataType.BIGINT,
      defaultValue: new Date().getTime(),
      allowNull: false
    }
  }, {
    freezeTableName: true,
  });
  messageTable.associate = (models) => {
    messageTable.hasMany(models.File, { foreignKey: { name: 'fkMessageId', allowNull: false}, foreignKeyConstraint: true });
    messageTable.hasMany(models.ChatMessage, { foreignKey: { name: 'fkMessageId', allowNull: false }, foreignKeyConstraint: true });
    messageTable.belongsTo(models.User, { foreignKey: { name: 'fkSenderId', allowNull: false }, foreignKeyConstraint: true });
    messageTable.belongsToMany(models.Conversation, {
      foreignKey: { name: 'fkMessageId', allowNull: false }, otherKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatMessage,
    });
  };
  return messageTable;
};
