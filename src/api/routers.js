const authRouters = require('./auth.api/auth.router');
const userRouters = require('./user.api/user.router');
const converSationRouters = require('./conversation.api/conversation.router');
const filesRouter = require('./files.api/files.router');

module.exports = {
  authRouters,
  userRouters,
  converSationRouters,
  filesRouter,
};
