module.exports = (sequelize, DataType) => {
  const userRoleTable = sequelize.define('UserRole', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fkUserId: {
      allowNull: false,
      type: DataType.INTEGER,
    },
    fkRoleId: {
      allowNull: false,
      type: DataType.INTEGER,
    },
  }, {
    freezeTableName: true,
    // indexes: [
    //   {
    //       unique: true,
    //       fields: ['fkRoleId', 'fkUserId']
    //   }
    // ],
    timestamps: false,
  });
  userRoleTable.associate = (models) => {
    userRoleTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    userRoleTable.belongsTo(models.Role, { foreignKey: { name: 'fkRoleId', allowNull: false }, foreignKeyConstraint: true });
  };
  return userRoleTable;
};
