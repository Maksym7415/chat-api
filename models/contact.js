const db = require('.');

const contactTable = db.sequelize.define('Contact', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: db.Sequelize.INTEGER
  },
  fkUserId: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: {
        tableName: 'User',
        key: 'id',
      },
    },
  },
  fkContactId: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: {
        tableName: 'User',
        key: 'id',
      },
    },
  },
  pseudonyme: {
    type: db.Sequelize.STRING
  },
  type: {
    type: db.Sequelize.STRING,
  },
},{
  freezeTableName: true,
});

module.exports = contactTable;