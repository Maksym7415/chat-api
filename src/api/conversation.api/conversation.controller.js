/* eslint-disable quotes */
const createError = require('http-errors');
const { sequelize, User } = require('../../../models');

module.exports = {
  getUserConversations: async (req, res, next) => {
    const { userId } = req.token;
    try {
      const isUser = User.findOne({ where: { id: userId } });
      if (isUser) {
        const queryString = `message.id as messageId,
            message.fkSenderId, message.message, 
            message.messageType, message.sendDate, 
            conversation.id as conversationId, 
            conversation.conversationType, 
            conversation.conversationCreationDate`;

        const userConversations = await sequelize.query(`
        select ${queryString}
            from message, conversation, chatmessage, user, chatuser
            where 
                message.id = chatmessage.fkMessageId and
                conversation.id = chatmessage.fkChatID and
                user.id = chatuser.fkUserId and
                chatuser.fkChatId = conversation.id 
                and user.id = ?
                and message.id in
                    (select max(message.id) from message, chatmessage where message.id = fkMessageId and sendDate in 
                        (select max(sendDate) from message, chatmessage where message.id = fkMessageId group by chatmessage.fkChatId) group by chatMessage.fkChatId);`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [`${userId}`],
        });
        return res.json(userConversations);
      }
      res.status(400).json('wrong user id');
    } catch (error) {
      next(createError(501, error));
    }
  },
};
