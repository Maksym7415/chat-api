const db = require('.');

const userTable = db.sequelize.define('User', {
  id:{
    type: db.Sequelize.INTEGER,
    autoIncrement:true,
    primaryKey: true,
  },
  login: {
    type: db.Sequelize.STRING(45),
    allowNull: false,
  },
  firstName: {
      type: db.Sequelize.STRING(45),
      allowNull: false,
  },
  lastName: {
    type: db.Sequelize.STRING(45),
    allowNull: true,
  },
  tagName: {
    type: db.Sequelize.STRING(45),
    allowNull: true,
  },
  fullName: {
    type: db.Sequelize.STRING(45),
    allowNull: true,
  },
  status: {
    type: db.Sequelize.STRING(45),
    allowNull: false,
  },
},{
  freezeTableName: true,
  timestamps: false
});

module.exports = userTable;