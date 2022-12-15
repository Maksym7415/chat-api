const {
  ChatMessage, Message, User, File, Conversation
} = require('../../../models');
const addChat = require('./addNewChatFunction');
const getSubscriptionsFromDatabase = require('../../helpers/notification_methods/getSubscriptionsFromDatabase');
const triggerPushMsg = require('../../helpers/notification_methods/triggerPushMessages');

module.exports = (io, socket) => socket.on('chats', async ({
  conversationId, message, userId, opponentId, messageId, isDeleteMessage, forwardedFromId,
}, successCallback) => { // successCallback to inform client about sucessfull sending of message
  let isEdit = false;
  console.log('MESSAGE', message);

  let newMessage = {};
  let user = {};
  let forwardedFrom = null;

  try {
    if (isDeleteMessage) {
      for (msgId of messageId) {
        await ChatMessage.destroy({
          where: {
            fkChatId: conversationId,
            fkMessageId: msgId,
          },
        });
        await File.destroy({
          where: {
            fkMessageId: msgId,
          },
        });
        await Message.destroy({
          where: {
            id: msgId,
          },
        });
      }
      const chatWhereMessageWasDeleted = await Conversation.findOne({ 
        where: { id: conversationId }, 
        include: {
          model: Message, 
          attributes: ['id', 'message', 'sendDate', 'isEdit'],
          required: false
        } 
      });

      const messages = chatWhereMessageWasDeleted.Messages;
      const lastMessage = messages[messages.length - 1];

      io.emit('deleteMessage', {
        conversationId, messageId, lastMessage
      });
    }
    if (!message) return successCallback(false);
    user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!conversationId) {
      const opponent = await User.findOne({
        where: {
          id: opponentId,
        },
      });
      const { newConversationId, newMessage } = await addChat(message, 'Dialog', [user, opponent]);
      io.emit(`userIdNewChat${userId}`, { ...newMessage, User: user }, newConversationId);
      return io.emit(`userIdNewChat${opponentId}`, { ...newMessage, User: user }, newConversationId);
    }
    if (messageId) {
      await Message.update({
        message: message.message,
        sendDate: message.sendDate,
        isEdit: true,
      }, {
        where: {
          id: messageId,
        },
      });
      isEdit = true;
    } else {

      if (forwardedFromId) {
        forwardedFrom = await User.findOne({
          where: {
            id: forwardedFromId,
          },
        });
      }

      newMessage = await Message.create({
        message: message.message,
        sendDate: message.sendDate,
        messageType: message.messageType,
        fkSenderId: message.fkSenderId,
        fkForwardedFromId: forwardedFrom?.id || null,
        isEdit,
      });
      await ChatMessage.create({
        fkChatId: conversationId,
        fkMessageId: newMessage.id,
      });
    }
    io.emit(`userIdChat${conversationId}`, {
      ...message, id: newMessage.id || messageId, Files: [], User: user, forwardedUser: forwardedFrom, isEdit,
    });
    successCallback(true);
    try {
      const subscriptions = await getSubscriptionsFromDatabase(12); // Нужно написать запрос к бд (opponents Id)
      let promiseChain = Promise.resolve();
      for (let i = 0; i < subscriptions.length; i++) {
        const { subscription, id } = subscriptions[i];
        promiseChain = promiseChain.then(async () => {
          try {
            setTimeout(() => triggerPushMsg({ subscription, id }, { id: conversationId, message: message.message }), 4000);
            return;
          } catch (err) {
            console.log(err);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  } catch (error) {
    console.log(error);
    successCallback(false);
  }
});
