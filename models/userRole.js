const db = require('.');

const userRoleTable = db.sequelize.define('UserRole', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement:true,
    primaryKey: true,
  },
  fkUserId: {
    allowNull: false,
    primaryKey: true,
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'User',
        key: 'id',
      },
    },
  },
  fkRoleId: {
    allowNull: false,
    primaryKey: true,
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'Role',
        key: 'id',
      },
    },
  },
},{
  freezeTableName: true,
  timestamps: false
});

module.exports = userRoleTable;