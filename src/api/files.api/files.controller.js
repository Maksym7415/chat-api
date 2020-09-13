const { Avatar, Conversation, User } = require('../../../models');

module.exports = {
  addFiles: async ({ token: { userId }, file: { filename }, query }, res, next) => {
    try {
      const user = User.findOne({ where: { id: userId } });
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
      return res.status(200).json({ message: 'upload is success' });
    } catch (e) {
      console.log(e);
    }
  },
};
