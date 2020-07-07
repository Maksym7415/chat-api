const db = require('.');

const sessionTable = db.sequelize.define('Session', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement:true,
    primaryKey: true,
  },
  accessToken: {
    type: db.Sequelize.STRING(255),
    allowNull: false
  },
},{
  freezeTableName: true,
});

module.exports = sessionTable;