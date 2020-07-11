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
    fkSessionId: {
      type: DataType.INTEGER,

    },
    userAgent: {
      type: DataType.STRING(200),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    indexes: [
      {
          unique: true,
          fields: ['fkSessionId', 'fkUserId']
      }
    ],
  });
  deviceTable.associate = (models) => {
    deviceTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    deviceTable.belongsTo(models.Session, { foreignKey: { name: 'fkSessionId', allowNull: false }, foreignKeyConstraint: true });
  };
  return deviceTable;
};
