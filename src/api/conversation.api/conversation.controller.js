/* eslint-disable quotes */
const createError = require('http-errors');
const {
  sequelize,
  User,
  Conversation,
  ChatUser,
  Message, 
  ChatMessage, 
  Sequelize
} = require('../../../models');
const {
  formErrorObject,
  MAIN_ERROR_CODES
} = require('../../../services/errorHandling');
const Op = Sequelize.Op;

module.exports = {
  getUserConversations: async (req, res, next) => {
    const {
      userId
    } = req.token;
    try {
      const isUser = User.findOne({
        where: {
          id: userId
        }
      });
      if (isUser) {
        // let userConversations = '';
        // const queryString = `message.id as messageId,
        //     message.fkSenderId, message.message, 
        //     message.messageType, message.sendDate, 
        //     conversation.id as conversationId, 
        //     conversation.conversationName,
        //     conversation.conversationType, 
        //     conversation.conversationCreationDate`;

        //  userConversations = await sequelize.query(`
        // select ${queryString}
        // from message, conversation, chatmessage, user, chatuser
        // where message.id = chatmessage.fkMessageId and conversation.id = chatmessage.fkChatID and user.id = chatuser.fkUserId 
        // and chatuser.fkChatId = conversation.id and user.id = 1 and sendDate in
        // (select max(sendDate) from message, chatmessage where message.id = fkMessageId group by chatmessage.fkChatId) group by chatmessage.fkChatId;`, {
        //   type: sequelize.QueryTypes.SELECT,
        //   replacements: [userId],
        // });

        // [sequelize.fn('max', sequelize.col('sendDate')), 'sendDate']
        const userConversations = await Conversation.findAll({
          group:['id'],
          include:[
          {
            model: User,
            attributes: [],
            through:{
              model: ChatUser,
              attributes: []
            },
            where: {
              id: userId
            }
          },
          {
            model: Message,
            attributes:['id','message','messageType','sendDate'],
            where: {
              sendDate: {
                [Op.in]: sequelize.literal('(select max(sendDate) from message, chatmessage where message.id = fkMessageId group by chatmessage.fkChatId)'),
              }
            },
            include:{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'fullName', 'tagName', 'status']
            },
            through:{
              model: ChatMessage,
              attributes:[],
            },
          }]
        });
        res.json(userConversations);
        return;
      }
      next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User does not exist')));
      // res.status(400).json('wrong user id');
    } catch (error) {
      console.log(error);
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
      // next(createError(501, error));
    }
  },

  conversationHistory: async (req, res, next) => {
    const {
      userId
    } = req.token;
    const conversationId = req.params.id;
    try {
      // const user = await User.findOne({ where: { id: userId } });
      const conversation = await Conversation.findOne({ where: { id: conversationId } });
      // if (!user) {
      //   next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User does not exist')));
      // }
      if (!conversation) {
        next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'Conversation does not exist')));
      } 
      else {
        const isUserConversation = await Conversation.findAll({
          where: {
            id: conversationId,
          },
          include: {
            model: User,
            through: {
              model: ChatUser
            },
            where: {
              id: userId
            }
          }
        });
        if (!isUserConversation.length) {
          next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'User has not access to this conversation')));
        } else {
          const conversationHistory = await Message.findAll({
            include:{
              model: Conversation,
              attributes: [],
              where: {
                id: conversationId,
              }
            }
          });
          res.json({data: conversationHistory, pagination: {allItems: 500, currentPage:1}});
        }
      }
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
    }
  }
};