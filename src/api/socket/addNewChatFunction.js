const {
  ChatMessage, Message, Conversation, ChatUser,
} = require('../../../models');

const addChat = async (message, chatType, chatUsers, chatName) => {
  try {
    let newMessage = {};
    let newChat = {};
    if (!chatName) {
      newChat = await Conversation.create({
        conversationType: chatType,
        conversationCreationDate: message.sendDate,
      });
    } else {
      newChat = await Conversation.create({
        conversationType: chatType,
        conversationCreationDate: message.sendDate,
        conversationName: chatName,
      });
    }

    chatUsers.forEach(async ({ id }) => {
      await ChatUser.create({
        fkChatId: newChat.id,
        fkUserId: id,
        fkPermissionId: 3,
      });
    });

    if (chatType === 'Dialog') {
      newMessage = await Message.create({
        message: message.message,
        sendDate: message.sendDate,
        messageType: message.messageType,
        fkSenderId: message.fkSenderId,
      });

      await ChatMessage.create({
        fkChatId: newChat.id,
        fkMessageId: newMessage.id,
      });
    }

    return { newConversationId: newChat.id, newMessage: newMessage.dataValues };
  } catch (e) {
    console.log({ e });
  }
};

module.exports = addChat;
