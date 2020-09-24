module.exports = (sequelize, DataType) => {
  const subscriptionTable = sequelize.define('Subscriptions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER,
    },
    fkUserId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    subscription: {
      type: DataType.STRING(500),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  subscriptionTable.associate = (models) => {
    subscriptionTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
  };
  return subscriptionTable;
};


