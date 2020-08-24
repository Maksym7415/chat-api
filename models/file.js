module.exports = (sequelize, DataType) => {
  const fileTable = sequelize.define('File', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileStorageName: {
      type: DataType.STRING(200),
      allowNull: false,
    },
    fileUserName: {
      type: DataType.STRING(200),
      allowNull: false,
    },
    size: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    extension: {
      type: DataType.STRING(20),
      allowNull: false,
    },
    fkMessageId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });

  fileTable.associate = (models) => {
    fileTable.belongsTo(models.Message, { foreignKey: { name: 'fkMessageId', allowNull: false }, foreignKeyConstraint: true });
  };

  return fileTable;
};
