module.exports = (sequelize, DataType) => {
  const productsTable = sequelize.define('Products', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: DataType.STRING,
      allowNull: true,
    },
    productPrice: {
      type: DataType.STRING,
      allowNull: true,
    },
    unitPrice: {
      type: DataType.STRING,
      allowNull: true,
    },
    barCode: {
      type: DataType.STRING,
      allowNull: true,
    },
    manufacturer: {
      type: DataType.STRING,
      allowNull: true,
    },
    prodCountry: {
      type: DataType.STRING,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
  });
  productsTable.associate = (models) => {
  };
  return productsTable;
};
