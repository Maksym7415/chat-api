module.exports = (sequelize, DataType) => {
  const sessionTable = sequelize.define('Session', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fkUserId: {
      type: DataType.INTEGER,
    },
    accessToken: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    refreshToken: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    userAgent: {
      type: DataType.STRING(200),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    timestamps: false
  });
  sessionTable.associate = (models) => {
    sessionTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
  };
  return sessionTable;
};
