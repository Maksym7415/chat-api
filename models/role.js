const db = require('.');
module.exports = (sequelize, DataType) => {
  const roleTable = sequelize.define('Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    description: {
      type: DataType.STRING(100)
    }
  },{
    freezeTableName: true,
    timestamps: false
  });
  roleTable.associate = function (models) {
    roleTable.hasMany(models.UserRole, { foreignKey: {name:'fkRoleId', allowNull:false}, foreignKeyConstraint: true });
};
return roleTable
}