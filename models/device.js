const db = require('.');

module.exports = (sequelize, DataType) => {
  const deviceTable = sequelize.define('Device', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER
    },
    fkUserId: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'User',
          key: 'id',
        },
      },
    },
    fkSesionId: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'Session',
          key: 'id',
        },
      },
    },
    userAgent: {
      type: DataType.STRING(100),
      allowNull: false
    }
  },{
    freezeTableName: true,
  });
  deviceTable.associate = function (models) {
    deviceTable.belongsTo(models.User, { foreignKey: {name:'fkUserId', allowNull:false}, foreignKeyConstraint: true });
    deviceTable.hasMany(models.Session, { foreignKey: {name:'fkSessionId', allowNull:false}, foreignKeyConstraint: true });
};
return deviceTable
}