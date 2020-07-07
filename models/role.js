const db = require('.');

const roleTable = db.sequelize.define('Role', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: db.Sequelize.INTEGER
  },
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: db.Sequelize.STRING(100)
  }
},{
  freezeTableName: true,
});

module.exports = roleTable;