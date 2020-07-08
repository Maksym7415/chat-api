
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
      allowNull: false,
      allowNull: false,
    },
    fkChatId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    fkPermissionId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
  },{
    freezeTableName: true,
  //   indexes: [
  //     {
  //         unique: true,
  //         fields: ['fkPermissionId', 'fkChatId', 'fkUserId']
  //     }
  // ]
  });
  chatUserTable.associate = function (models) {
    chatUserTable.belongsTo(models.Permission, { foreignKey: {name:'fkPermissionId', allowNull:false}, foreignKeyConstraint: true });
    chatUserTable.belongsTo(models.Conversation, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
    chatUserTable.belongsTo(models.User, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });
};
return chatUserTable;
}
