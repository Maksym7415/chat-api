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
      allowNull: false,
    },
    fkContactId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    pseudonyme: {
      type: DataType.STRING,
      allowNull: true,
    },
    type: {
      type: DataType.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    indexes: [
      {
          unique: true,
          fields: ['fkContactId', 'fkUserId']
      }
    ],
  });
  contactTable.associate = (models) => {
    contactTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
    contactTable.belongsTo(models.User, { foreignKey: { name: 'fkContactId', allowNull: false }, foreignKeyConstraint: true });
  };
  return contactTable;
};
