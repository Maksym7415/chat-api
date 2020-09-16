const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  getUserProfileData,
  setMainUserPhoto,
  getUserAvatars,
  updateUserProfile,
} = require('./user.controller');

router.get('/getUserProfileData/', authMiddleware, getUserProfileData);
router.put('/setMainPhoto/:photoId', authMiddleware, setMainUserPhoto);
router.get('/getAvatars', authMiddleware, getUserAvatars);
router.put('/updateProfile', authMiddleware, updateUserProfile);

module.exports = router;
