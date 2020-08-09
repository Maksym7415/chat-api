/* eslint-disable quotes */
const createError = require('http-errors');
const {
  sequelize,
  User,
  Conversation,
  ChatUser,
  Message,
  ChatMessage,
  Sequelize,
} = require('../../../models');
const {
  formErrorObject,
  MAIN_ERROR_CODES,
} = require('../../../services/errorHandling');

const { Op } = Sequelize;

module.exports = {
  getUserConversations: async (req, res, next) => {
    const {
      userId,
    } = req.token;
    try {
      const isUser = User.findOne({
        where: {
          id: userId,
        },
      });
      if (isUser) {
        // >>>DO NOT DELETE<<<
        //
        // select message.id as 'Message ID', message.message, conversation.id as 'Conv ID',
        // ifnull(conversationName, (select max(user.fullName) from user, chatuser where user.id = fkUserId and fkChatId = conversation.id and user.id != 1)) as 'Title',
        // conversationType, user.id as 'User ID', sendDate, fkSenderId
        // from conversation left join chatmessage on chatmessage.fkChatId = conversation.id left join message on chatmessage.fkMessageId = message.id
        // left join chatuser on chatuser.fkChatId = conversation.id left join user on chatuser.fkUserId = user.id
        // where user.id = 1 and (sendDate in
        // (select max(sendDate) from message, chatmessage where message.id = fkMessageId group by chatmessage.fkChatId) or sendDate is null) group by chatmessage.fkChatId;

        const userConversations = await Conversation.findAll({
          group: ['id'],
          attributes: [['id', 'conversationId'], [sequelize.fn('ifnull', sequelize.col('conversationName'), sequelize.literal(`(select max(user.fullName) from user, chatuser where user.id = fkUserId and fkChatId = conversation.id and user.id != ${userId})`)), 'conversationName'], 'conversationType', 'conversationCreationDate'],
          include: [
            {
              model: User,
              attributes: [],
              through: {
                model: ChatUser,
                attributes: [],
              },
              where: {
                id: userId,
              },
            },
            {
              model: Message,
              attributes: ['id', 'message', 'messageType', 'sendDate'],
              required: false,
              where: {
                sendDate: {
                  [Op.in]: sequelize.literal('(select max(sendDate) from message, chatmessage where message.id = fkMessageId group by chatmessage.fkChatId)'),
                },
              },
              include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'fullName', 'tagName', 'status'],
              },
              through: {
                model: ChatMessage,
                attributes: [],
              },
            }],
        });
        return res.json({ data: userConversations });
      }
      next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User does not exist')));
    } catch (error) {
      console.log(error);
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },

  conversationHistory: async (req, res, next) => {
    const {
      userId,
    } = req.token;
    const conversationId = req.params.id;
    try {
      const conversation = await Conversation.findOne({ where: { id: conversationId } });
      if (!conversation) {
        next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'Conversation does not exist')));
      } else {
        const isUserConversation = await Conversation.findAll({
          where: {
            id: conversationId,
          },
          include: {
            model: User,
            through: {
              model: ChatUser,
            },
            where: {
              id: userId,
            },
          },
        });
        if (!isUserConversation.length) {
          next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'User has not access to this conversation')));
        } else {
          const conversationHistory = await Message.findAll({
            include: {
              model: Conversation,
              attributes: [],
              where: {
                id: conversationId,
              },
            },
          });
          res.json({ data: conversationHistory, pagination: { allItems: 500, currentPage: 1 } });
        }
      }
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },
};
