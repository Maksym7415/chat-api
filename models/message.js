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
      references: {
        model: {
          tableName: 'User',
          key: 'id',
        },
      },
      allowNull: false,
    },
    file: {
      type: DataType.STRING(100),
      allowNull: true,
    },
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
