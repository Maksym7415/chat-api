const db = require('.');

const chatUserTable = db.sequelize.define('ChatUser', {
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
        key: 'idUser',
      },
    },
    allowNull: false,
  },
  fkChatId: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: {
        tableName: 'Conversation',
        key: 'id',
      },
    },
    allowNull: false,
  },
  fkPermissionId: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: {
        tableName: 'Permission',
        key: 'id',
      },
    },
    allowNull: false,
  },
},{
  freezeTableName: true,
});

module.exports = chatUserTable;