const db = require('.');

const chatMessageTable = db.sequelize.define('Message', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fkChatId: {
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'Conversation',
        key: 'id',
      },
    },
  },
  fkMessageId: {
    type: db.Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'Message',
        key: 'id',
      },
    },
  },
},{
  freezeTableName: true,
});

module.exports = chatMessageTable;