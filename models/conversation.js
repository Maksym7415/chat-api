


module.exports = (sequelize, DataType) => {
  const conversationTable =  sequelize.define('Conversation', {
    id: {
      type: DataType.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    },
    chatType: {
      type: DataType.STRING,
      allowNull: false,
    }
  },{
    freezeTableName: true,
  });
  conversationTable.associate = function (models) {
    conversationTable.hasMany(models.ChatUser, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
    conversationTable.hasMany(models.ChatMessage, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
};
return conversationTable
}