module.exports = (sequelize, DataType) => {
  const contactTable = sequelize.define('Contact', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER,
    },
    fkUserId: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    fkContactId: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    pseudonyme: {
      type: DataType.STRING,
    },
    type: {
      type: DataType.STRING,
    },
  }, {
    freezeTableName: true,
  });
  contactTable.associate = (models) => {
    contactTable.belongsTo(models.User, { foreignKey: { name: 'fkContactId', allowNull: false }, foreignKeyConstraint: true });
  };
  return contactTable;
};
