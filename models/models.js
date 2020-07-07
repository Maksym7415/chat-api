const userTable = require('./user');
const messageTable = require('./message');
const chatMessageTable = require('./chatMessage');
const chatUserTable = require('./chatUser');
const contactTable = require('./contact');
const conversationTable = require('./conversation');
const deviceTable = require('./device');
const permissionTable = require('./permission');
const roleTable = require('./role');
const sessionTable = require('./session');
const userRoleTable = require('./userRole');


module.exports = {
  userTable,
  messageTable,
  chatMessageTable,
  chatUserTable,
  contactTable,
  conversationTable,
  deviceTable,
  permissionTable,
  roleTable,
  sessionTable,
  userRoleTable
}
