const router = require('express').Router();

const {
  signUp, signIn, checkVerificationCode, refreshToken,
} = require('./auth.controller');

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/checkVerificationCode', checkVerificationCode);
router.post('/refreshToken', refreshToken);

module.exports = router;
