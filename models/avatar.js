module.exports = (sequelize, DataType) => {
  const avatarTable = sequelize.define('Avatar', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: {
      allowNull: false,
      type: DataType.STRING(200),
    },
    defaultAvatar: {
      allowNull: false,
      type: DataType.BOOLEAN,
    },
    fkUserId: {
      allowNull: false,
      type: DataType.INTEGER,
    },

  }, {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['fkUserId'],
      },
    ],
  });
  avatarTable.associate = (models) => {
    avatarTable.belongsTo(models.User, { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true });
  };
  return avatarTable;
};
