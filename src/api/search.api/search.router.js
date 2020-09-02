const router = require('express').Router();
const authMiddleWare = require('../middleware/auth');

const {
  getAllContact,
} = require('./search.controller');

router.get('/searchContact', authMiddleWare, getAllContact);

module.exports = router;
