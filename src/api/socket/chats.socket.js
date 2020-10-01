const {
  ChatMessage, Message, User, File,
} = require('../../../models');
const addChat = require('./addNewChatFunction');
const getSubscriptionsFromDatabase = require('../../helpers/notification_methods/getSubscriptionsFromDatabase');
const triggerPushMsg = require('../../helpers/notification_methods/triggerPushMessages');

module.exports = (io, socket) => socket.on('chats', async ({
  conversationId, message, userId, opponentId, messageId, isDeleteMessage,
}, successCallback) => { // successCallback to inform client about sucessfull sending of message
  let isEdit = false;
  console.log('MESSAGE', message);

  let newMessage = {};
  let user = {};

  try {
    if (isDeleteMessage) {
      await ChatMessage.destroy({
        where: {
          fkChatId: conversationId,
          fkMessageId: messageId,
        },
      });
      await File.destroy({
        where: {
          fkMessageId: messageId,
        },
      });
      await Message.destroy({
        where: {
          id: messageId,
        },
      });
      io.emit('deleteMessage', {
        conversationId, messageId,
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
      // await sequelize.query(`update messenger.message
      // set
      //   message = ${message.message},
      //   sendDate = ${message.sendDate}
      //   where id in
      //     (select fkMessageId from messenger.chatmessage
      //     where fkChatId = ${conversationId} and fkMessageId=${messageId})`);
      await Message.update({
        message: message.message,
        sendDate: message.sendDate,
      }, {
        where: {
          id: messageId,
        },
      });
      isEdit = true;
    } else {
      newMessage = await Message.create({
        message: message.message,
        sendDate: message.sendDate,
        messageType: message.messageType,
        fkSenderId: message.fkSenderId,
        isEditing: true,
      });
      await ChatMessage.create({
        fkChatId: conversationId,
        fkMessageId: newMessage.id,
      });
    }
    io.emit(`userIdChat${conversationId}`, {
      ...message, id: newMessage.id || messageId, Files: [], User: user, isEdit,
    });
    successCallback(true);
    try {
      const subscriptions = await getSubscriptionsFromDatabase(11); // Нужно написать запрос к бд (opponents Id)
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
