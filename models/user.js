module.exports = (sequelize, DataType) => {
  const userTable = sequelize.define('User', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataType.STRING(45),
      allowNull: false,
    },
    firstName: {
      type: DataType.STRING(45),
      allowNull: false,
    },
    lastName: {
      type: DataType.STRING(45),
      allowNull: true,
    },
    tagName: {
      type: DataType.STRING(45),
      allowNull: true,
    },
    fullName: {
      type: DataType.STRING(45),
      allowNull: true,
    },
    status: {
      type: DataType.STRING(45),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  userTable.associate = (models) => {
    userTable.hasMany(models.Device, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasOne(models.Contact, { foreignKey: { name: 'fkContactId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.UserRole, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.ChatUser, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.belongsToMany(models.Conversation, {
      foreignKey: { name: 'fkUserId', allowNull: false }, otherKey: { name: 'fkChatId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatUser,
    });
    userTable.belongsToMany(models.Role, {
      foreignKey: { name: 'fkUserId', allowNull: false }, otherKey: { name: 'fkRoleId', allowNull: false }, foreignKeyConstraint: true, through: models.UserRole,
    });
    userTable.belongsToMany(models.Permission, {
      foreignKey: { name: 'fkUserId', allowNull: false }, otherKey: { name: 'fkPermissionId', allowNull: false }, foreignKeyConstraint: true, through: models.ChatUser,
    });
  };
  return userTable;
};