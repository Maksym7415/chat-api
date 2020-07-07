const db = require('.');

module.exports = (sequelize, DataType) => {
  const permissionTable = sequelize.define('Permission', {
    id: {
      type: DataType.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    description: {
      type: DataType.STRING,
      allowNull: true,
    }
  },{
    freezeTableName: true,
  });
  permissionTable.associate = function (models) {
    permissionTable.hasMany(models.ChatUser, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
};
return permissionTable
}