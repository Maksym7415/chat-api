const router = require('express').Router();
const authMiddleware = require('../middleware/auth');

const {
  getUserConversations,
  conversationHistory,
} = require('./conversation.controller');

router.get('/getUserConversations', authMiddleware, getUserConversations);

router.get('/conversationHistory/:id', authMiddleware, conversationHistory);

module.exports = router;
