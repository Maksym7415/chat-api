const router = require('express').Router();

const {
  signUp, signIn,
} = require('./user.controller');

router.post('/signUp', signUp);
router.post('/signIn', signIn);
// router.post('/sendCheckCode', sendCheckCode);
module.exports = router;
