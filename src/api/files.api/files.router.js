/* eslint-disable prefer-template */
const router = require('express').Router();
const multer = require('multer');
const uuid = require('uuid');
const {
  addFiles, addMessageFiles,
} = require('./files.controller');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    const name = uuid.v1();
    const extension = file.originalname.split('.');
    cb(null, `${name}.${extension[extension.length - 1]}`);
  },
});
// router.use('/', express.static(path.join(__dirname, '../../../uploads')));
const upload = multer({ storage });
router.post('/upload', authMiddleware, upload.single('file'), addFiles);
router.post('/upload-message-files', upload.array('file', 10), addMessageFiles);

module.exports = router;
