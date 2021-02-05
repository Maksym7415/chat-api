module.exports = (sequelize, DataType) => {
  const userTable = sequelize.define('User', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    socketId: {
      type: DataType.STRING(50),
      allowNull: true,
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
    activityStatus: {
      type: DataType.STRING(15),
      allowNull: false,
    },
    status: {
      type: DataType.STRING(45),
      allowNull: false,
    },
    verificationCode: {
      type: DataType.STRING(45),
      allowNull: true,
    },
    userAvatar: {
      type: DataType.STRING(100),
      allowNull: true,
    },
    userCreationTime: {
      type: DataType.DATE,
      defaultValue: DataType.NOW,
      allowNull: false,
    },
    userUpdateTime: {
      type: DataType.DATE,
      allowNull: true,
    },
    userLastTimeOnline: {
      type: DataType.DATE,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  userTable.associate = (models) => {
    userTable.hasMany(models.Avatar, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.Session, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.Contact, { foreignKey: { name: 'fkContactId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.Contact, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.UserRole, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.ChatUser, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userTable.hasMany(models.Message, { foreignKey: { name: 'fkSenderId', allowNull: false }, foreignKeyConstraint: true });
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
