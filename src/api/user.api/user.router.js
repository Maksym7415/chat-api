const router = require('express').Router();

const {
  signUp, SignIn, sendCheckCode,
} = require('./users.controller');

router.post('/signUp', signUp);
router.post('/SignIn', SignIn);
router.post('/sendCheckCode', sendCheckCode);
