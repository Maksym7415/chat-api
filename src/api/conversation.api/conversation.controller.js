/* eslint-disable quotes */
const createError = require('http-errors');
const { sequelize } = require('../../../models');

module.exports = {
  getUserConversations: async (req, res, next) => {
    const { userId } = req.token;
    try {
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
                    (select message.id from message,chatmessage
                        where 
                            message.id = fkMessageId group by chatMessage.fkChatId having max(message.sendDate))`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: [`${userId}`],
      });
      res.json(userConversations);
    } catch (error) {
      next(createError(501, error));
    }
  },
};
