const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  getUserProfileData,
  setMainUserPhoto,
  getUserAvatars,
  updateUserProfile,
  getUserProfileById,
  signNotification,
} = require('./user.controller');

router.get('/getUserProfileData/', authMiddleware, getUserProfileData);
router.get('/getUserProfileById/:id', authMiddleware, getUserProfileById);
router.put('/setMainPhoto/:photoId', authMiddleware, setMainUserPhoto);
router.get('/getAvatars', authMiddleware, getUserAvatars);
router.put('/updateProfile', authMiddleware, updateUserProfile);
router.post('/save-subscription/:id', signNotification);

module.exports = router;
