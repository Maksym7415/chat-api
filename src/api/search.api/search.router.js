const router = require('express').Router();

const {
  getAllContact,
} = require('./search.controller');

router.get('/searchContact', getAllContact);

module.exports = router;
