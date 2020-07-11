const router = require('express').Router();

const {
  signUp, signIn, checkVerificationCode,
} = require('./user.controller');

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/checkVerificationCode', checkVerificationCode);

module.exports = router;
