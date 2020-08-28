const authRouters = require('./auth.api/auth.router');
const userRouters = require('./user.api/user.router');
const converSationRouters = require('./conversation.api/conversation.router');
const filesRouter = require('./files.api/files.router');
const searchRouter = require('./search.api/search.router');

module.exports = {
  authRouters,
  userRouters,
  converSationRouters,
  filesRouter,
  searchRouter,
};
