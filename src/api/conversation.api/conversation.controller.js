/* eslint-disable max-len */
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
  File,
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
          attributes: [['id', 'conversationId'], [sequelize.fn('ifnull', sequelize.col('conversationName'), sequelize.literal(`(select max(User.fullName) from User, ChatUser where User.id = fkUserId and fkChatId = Conversation.id and User.id != ${userId})`)), 'conversationName'], 'conversationAvatar', 'conversationType', 'conversationCreationDate'],
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
              attributes: ['id', 'message', 'sendDate', 'isEdit'],
              required: false,
              where: {
                sendDate: {
                  [Op.in]: sequelize.literal('(select max(sendDate) from Message, ChatMessage where Message.id = fkMessageId group by ChatMessage.fkChatId)'),
                },
              },
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName', 'fullName', 'tagName', 'status'],
                },
                {
                  model: User,
                  as: "forwardedUser",
                  attributes: ['id', 'firstName', 'lastName', 'fullName', 'tagName', 'status'],
                },
              ],
              through: {
                model: ChatMessage,
                attributes: [],
              },
            }],
        });
        return res.json({ data: userConversations });
      }
      return next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User does not exist')));
    } catch (error) {
      console.log(error);
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },

  conversationHistory: async ({ token: { userId }, params: { id: conversationId }, query: { offset } }, res, next) => {
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
          // >>>DO NOT DELETE<<<
          //
          // select * from
          // (select message.id as 'm_id', user.id as 'u_id', sendDate from message, user where message.fkSenderId = user.id order by sendDate desc limit 10)
          // as Message_Limit
          // order by sendDate asc;
          const allChatMessagesCount = await Message.count({
            order: [
              ['sendDate', 'DESC'],
            ],
            include: [
              {
                model: Conversation,
                attributes: [],
                where: {
                  id: conversationId,
                },
              },
              {
                model: File,
              },
              {
                model: User,
              },
              {
                model: User,
                as: "forwardedUser",
                attributes: ['id', 'firstName', 'lastName', 'fullName', 'tagName', 'status'],
              },
            ],
          });
          const conversationHistory = await Message.findAll({
            limit: 15,
            offset: +offset,

            order: [
              ['sendDate', 'DESC'],
            ],
            include: [{
              model: Conversation,
              attributes: [],
              where: {
                id: conversationId,
              },
            },
            {
              model: File,
            },
            {
              model: User,
            },
            {
              model: User,
              as: "forwardedUser",
              attributes: ['id', 'firstName', 'lastName', 'fullName', 'tagName', 'status'],
            },
            ],
          });
          // res.json({ data: conversationHistory, pagination: { allItems: 500, currentPage: 1 } });
          res.json({ data: conversationHistory.reverse(), pagination: { allItems: allChatMessagesCount, currentPage: +offset } });
        }
      }
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },
  getOpponentsIdWhereConversTypeDialog: async ({ query: { opponentId, userId } }, res, next) => {
    try {
      const data = await sequelize.query(`
            select id from messenger.Conversation where conversationType = 'Dialog' and id in 
            (select fkChatId from messenger.ChatUser where fkUserId = ${opponentId} and fkChatId in 
            (select fkChatId FROM messenger.ChatUser where fkUserId = ${userId}))`, { type: sequelize.QueryTypes.SELECT });
      return res.json({ data });
    } catch (e) {
      // console.log('GET OPPENENTS', { e });
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  },
};
