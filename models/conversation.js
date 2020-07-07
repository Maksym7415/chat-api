const db = require('.');

const conversationTable = db.sequelize.define('Conversation', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement:true,
    primaryKey: true,
  },
  chatType: {
    type: db.Sequelize.STRING,
    allowNull: false,
  }
},{
  freezeTableName: true,
});

module.exports = conversationTable;