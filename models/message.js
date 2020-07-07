const db = require('.');

const messageTable = db.sequelize.define('Message', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
      type: db.Sequelize.STRING(1000),
      allowNull: true,
  },
  idSender: {
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'User',
        key: 'id',
      },
    },
    allowNull: false,
  },
  file: {
    type: db.Sequelize.STRING(45),
    allowNull: true,
  },
},{
  freezeTableName: true,
});

module.exports = messageTable;