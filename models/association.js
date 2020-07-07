const generateAssociations = (models) => {
  models.messageTable.hasMany(models.chatMessageTable, { foreignKey: {name:'fkMessageId', allowNull:false}, foreignKeyConstraint: true });
  models.chatMessageTable.belongsTo(models.messageTable, { foreignKey: {name:'fkMessageId', allowNull:false}, foreignKeyConstraint: true });
  
  models.userTable.hasMany(models.userRoleTable, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });
  models.userRoleTable.belongsTo(models.userTable, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });

  models.userTable.hasOne(models.contactTable, { foreignKey: {name:'fkContactId', allowNull:false}, foreignKeyConstraint: true });
  models.contactTable.belongsTo(models.userTable, { foreignKey: {name:'fkContactId', allowNull:false}, foreignKeyConstraint: true });

  models.conversationTable.hasMany(models.chatUserTable, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
  models.chatUserTable.belongsTo(models.conversationTable, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });

  models.conversationTable.hasMany(models.chatMessageTable, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
  models.chatMessageTable.belongsTo(models.conversationTable, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });

  models.userTable.hasMany(models.deviceTable, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });
  models.deviceTable.belongsTo(models.userTable, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });

  models.deviceTable.hasMany(models.sessionTable, { foreignKey: {name:'fkSessionId', allowNull:false}, foreignKeyConstraint: true });
  models.sessionTable.belongsTo(models.deviceTable, { foreignKey: {name:'fkSessionId', allowNull:false}, foreignKeyConstraint: true });

  models.permissionTable.hasMany(models.chatUserTable, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });
  models.chatUserTable.belongsTo(models.permissionTable, { foreignKey: {name:'fkChatId', allowNull:false}, foreignKeyConstraint: true });

  models.roleTable.hasMany(models.userRoleTable, { foreignKey: {name:'fkRoleId', allowNull:false}, foreignKeyConstraint: true });
  models.userRoleTable.belongsTo(models.roleTable, { foreignKey: {name:'fkRoleId', allowNull:false}, foreignKeyConstraint: true });
}

module.exports = generateAssociations;

