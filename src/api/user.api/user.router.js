const router = require('express').Router();

const {
  getUserProfileData,
} = require('./user.controller');

router.get('/getUserProfileData/:id', getUserProfileData);

module.exports = router;
