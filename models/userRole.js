const db = require('.');

module.exports = (sequelize, DataType) => {
  const userRoleTable = sequelize.define('UserRole', {
    id: {
      type: DataType.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    },
    fkUserId: {
      allowNull: false,
      primaryKey: true,
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'User',
          key: 'id',
        },
      },
    },
    fkRoleId: {
      allowNull: false,
      primaryKey: true,
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'Role',
          key: 'id',
        },
      },
    },
  },{
    freezeTableName: true,
    timestamps: false
  });
  userRoleTable.associate = function (models) {
    userRoleTable.belongsTo(models.User, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });
    userRoleTable.belongsTo(models.Role, { foreignKey: {name:'fkRoleId', allowNull:false}, foreignKeyConstraint: true });
};
return userRoleTable
}