const router = require('express').Router();
const authMiddleware = require('../middleware/auth');

const {
  getUserConversations,
  conversationHistory,
  getOpponentsIdWhereConversTypeDialog,
  getConversationById,
} = require('./conversation.controller');

router.get('/getUserConversations', authMiddleware, getUserConversations);

router.get('/conversationHistory/:id', authMiddleware, conversationHistory);

router.get('/getOpponentsIdWhereConversTypeDialog', getOpponentsIdWhereConversTypeDialog);

router.get('/getConversation/:id', getConversationById);

module.exports = router;
