const {
  ChatMessage, Message, User, File, Conversation,
} = require('../../../models');
const addChat = require('./addNewChatFunction');

module.exports = (io, socket) => socket.on('chats', async ({
  conversationId, message, userId, opponentId,
}, successCallback) => { // successCallback to inform client about sucessfull sending of message
  if (!message) return successCallback(false);
  try {
    if (!conversationId) {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      const opponent = await User.findOne({
        where: {
          id: opponentId,
        },
      });
      const { newConversationId, newMessage } = await addChat(opponentId, message, 'Dialog', [user, opponent]);
      console.log(newConversationId, newMessage);
      io.emit(`userIdNewChat${userId}`, { ...newMessage, User: user }, newConversationId);
      return io.emit(`userIdNewChat${opponentId}`, { ...newMessage, User: user }, newConversationId);
    }
    const newMessage = await Message.create({
      message: message.message,
      sendDate: message.sendDate,
      messageType: message.messageType,
      fkSenderId: message.fkSenderId,
    });
    await ChatMessage.create({
      fkChatId: conversationId,
      fkMessageId: newMessage.id,
    });
    const user = await User.findOne(
      {
        where: {
          id: userId,
        },
      },
    );
    console.log('SUCCESS');
    io.emit(`userIdChat${conversationId}`, {
      ...message, id: newMessage.id, Files: [], User: user,
    });
    successCallback(true);
  } catch (error) {
    successCallback(false);
  }
});
