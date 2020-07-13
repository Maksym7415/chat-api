const router = require('express').Router();

const {
  signUp, signIn, checkVerificationCode, generateNewTokens,
} = require('./user.controller');

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/checkVerificationCode', checkVerificationCode);
router.post('/refreshToken', generateNewTokens);

module.exports = router;
