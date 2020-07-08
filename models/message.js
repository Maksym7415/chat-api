const db = require('.');

module.exports = (sequelize, DataType) => {
  const messageTable = sequelize.define('Message', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
        type: DataType.STRING(1000),
        allowNull: true,
    },
    idSender: {
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
      type: DataType.STRING(45),
      allowNull: true,
    },
  },{
    freezeTableName: true,
  });
  messageTable.associate = function (models) {
    messageTable.hasMany(models.ChatMessage, { foreignKey: {name:'fkMessageId', allowNull:false}, foreignKeyConstraint: true });
    messageTable.belongsToMany(models.Conversation, {foreignKey: {name:'fkMessageId', allowNull:false}, otherKey: {name: 'fkChatId', allowNull:false},  foreignKeyConstraint: true, through: models.ChatMessage})
};
return messageTable
}