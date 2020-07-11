module.exports = (sequelize, DataType) => {
  const deviceTable = sequelize.define('Device', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER,
    },
    fkUserId: {
      type: DataType.INTEGER,
    },
    fkSesionId: {
      type: DataType.INTEGER,

    },
    userAgent: {
      type: DataType.STRING(100),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });
  deviceTable.associate = (models) => {
    deviceTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    deviceTable.hasMany(models.Session, { foreignKey: { name: 'fkSessionId', allowNull: false }, foreignKeyConstraint: true });
  };
  return deviceTable;
};
