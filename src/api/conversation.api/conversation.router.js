const router = require('express').Router();
const authMiddleware = require('../middleware/auth');

const {
  getUserConversations,
} = require('./conversation.controller');

router.get('/getUserConversations', authMiddleware, getUserConversations);

module.exports = router;
