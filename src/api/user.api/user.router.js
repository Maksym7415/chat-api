const router = require('express').Router();

const {
  getUserProfileData,
  setMainUserPhoto,
} = require('./user.controller');

router.get('/getUserProfileData/:id', getUserProfileData);
router.put('/setMainUserPhoto/:userId/:photoId', setMainUserPhoto);

module.exports = router;
