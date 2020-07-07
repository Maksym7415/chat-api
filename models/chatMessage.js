
module.exports = (sequelize, DataType) => {
  const chatMessageTable = sequelize.define('ChatMessage', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fkChatId: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'Conversation',
          key: 'id',
        },
      },
    },
    fkMessageId: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'Message',
          key: 'id',
        },
      },
    },
  },{
    freezeTableName: true,
  });
  chatMessageTable.associate = function (models) {
    chatMessageTable.belongsTo(models.User, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });
};
return chatMessageTable
}

