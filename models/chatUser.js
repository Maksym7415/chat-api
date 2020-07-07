
module.exports = (sequelize, DataType) => {
  const chatUserTable = sequelize.define('ChatUser', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER
    },
    fkUserId: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: {
          tableName: 'User',
          key: 'idUser',
        },
      },
      allowNull: false,
    },
    fkChatId: {
      type: DataType.INTEGER,
      primaryKey: true,
      references: {
        model: {
          tableName: 'Conversation',
          key: 'id',
        },
      },
      allowNull: false,
    },
    fkPermissionId: {
      type: DataType.INTEGER,
      primaryKey: true,
      references: {
        model: {
          tableName: 'Permission',
          key: 'id',
        },
      },
      allowNull: false,
    },
  },{
    freezeTableName: true,
  });
  chatUserTable.associate = function (models) {
    chatUserTable.belongsTo(models.Permission, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
    chatUserTable.belongsTo(models.Conversation, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
};
return chatUserTable;
}
