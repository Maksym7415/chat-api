const db = require('.');

const permissionTable = db.sequelize.define('Permission', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement:true,
    primaryKey: true,
  },
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: db.Sequelize.STRING,
    allowNull: true,
  }
},{
  freezeTableName: true,
});

module.exports = permissionTable;