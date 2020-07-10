module.exports = (sequelize, DataType) => {
  const permissionTable = sequelize.define('Permission', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    description: {
      type: DataType.STRING,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
  });
  permissionTable.associate = (models) => {
    permissionTable.hasMany(models.ChatUser, { foreignKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true });
    permissionTable.hasMany(models.ChatUser, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    permissionTable.belongsToMany(models.Conversation, {
      foreignKey: { name: 'fkPermissionId', allowNull: false }, otherKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatUser,
    });
    permissionTable.belongsToMany(models.User, {
      foreignKey: { name: 'fkPermissionId', allowNull: false }, otherKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatUser,
    });
  };
  return permissionTable;
};
