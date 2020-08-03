module.exports = (sequelize, DataType) => {
  const conversationTable = sequelize.define('Conversation', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationName: {
      type: DataType.STRING,
      allowNull: true,
    },
    conversationType: {
      type: DataType.STRING,
      allowNull: false,
    },
    conversationCreationDate: {
      type: DataType.DATE,
      defaultValue: DataType.NOW,
      allowNull: false,
    },
    conversationUpdateDate: {
      type: DataType.DATE,
      allowNull: true,
    }
  }, {
    freezeTableName: true,
  });
  conversationTable.associate = (models) => {
    conversationTable.hasMany(models.ChatUser, { foreignKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true });
    conversationTable.hasMany(models.ChatMessage, { foreignKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true });
    conversationTable.belongsToMany(models.Message, {
      foreignKey: { name: 'fkChatId', allowNull: false }, otherKey: { name: 'fkMessageId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatMessage,
    });
    conversationTable.belongsToMany(models.User, {
      foreignKey: { name: 'fkChatId', allowNull: false }, otherKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatUser,
    });
    conversationTable.belongsToMany(models.Permission, {
      foreignKey: { name: 'fkChatId', allowNull: false }, otherKey: { name: 'fkPermissionId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatUser,
    });
  };
  return conversationTable;
};
