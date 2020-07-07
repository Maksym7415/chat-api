const db = require('.');

const deviceTable = db.sequelize.define('Device', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: db.Sequelize.INTEGER
  },
  fkUserId: {
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'User',
        key: 'id',
      },
    },
  },
  fkSesionId: {
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'Session',
        key: 'id',
      },
    },
  },
  userAgent: {
    type: db.Sequelize.STRING(100),
    allowNull: false
  }
},{
  freezeTableName: true,
});

module.exports = deviceTable;