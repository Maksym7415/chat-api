const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  getUserProfileData,
  setMainUserPhoto,
  getUserAvatars,
} = require('./user.controller');

router.get('/getUserProfileData/:id', getUserProfileData);
router.put('/setMainPhoto/:photoId', authMiddleware, setMainUserPhoto);
router.get('/getAvatars', authMiddleware, getUserAvatars);

module.exports = router;
