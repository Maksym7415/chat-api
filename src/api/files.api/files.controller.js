const createError = require('http-errors');
const { Avatar, Conversation, User } = require('../../../models');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../../services/errorHandling');

module.exports = {
  addFiles: async ({ token: { userId }, file: { filename }, query }, res, next) => {
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        if (query.chatId) {
          await Conversation.update({
            conversationAvatar: filename,
          },
          {
            where: {
              id: query.chatId,
            },
          });
        } else if (!user.userAvatar) {
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
      next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User not found')));
    } catch (e) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },
};
