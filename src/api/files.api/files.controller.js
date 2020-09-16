const createError = require('http-errors');
const { Avatar, Conversation, User } = require('../../../models');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../../services/errorHandling');

module.exports = {
  addFiles: async ({ token: { userId }, file: { filename } }, res, next) => {
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (filename) {
        if (!user.userAvatar) {
          await User.update({
            userAvatar: filename,
          },
          {
            where: {
              id: userId,
            },
          });
        } else {
          await Avatar.create({
            fileName: filename,
            fkUserId: userId,
            defaultAvatar: true,
          });
        }
        return res.status(200).json('upload is success');
      }
      next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION, 'File is not recognized')));
    } catch (e) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },
};
