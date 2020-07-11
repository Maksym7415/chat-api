module.exports = (sequelize, DataType) => {
  const sessionTable = sequelize.define('Session', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accessToken: {
      type: DataType.STRING(255),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    timestamps: false
  });
  sessionTable.associate = (models) => {
    sessionTable.hasMany(models.Device, { foreignKey: { name: 'fkSessionId', allowNull: false }, foreignKeyConstraint: true });
  };
  return sessionTable;
};
