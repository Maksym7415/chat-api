const {
  ChatMessage, Message, User, File, Conversation, ChatUser, Contact,
} = require('../../../models');

const addChat = async (opponentId, message, chatType, chatUsers) => {
  try {
    const { firstName } = await User.findOne({
      where: {
        id: opponentId,
      },
    });

    const newChat = await Conversation.create({
      conversationName: firstName,
      conversationType: chatType,
      conversationCreationDate: message.sendDate,
    });

    chatUsers.forEach(async ({ id }) => {
      await ChatUser.create({
        fkChatId: newChat.id,
        fkUserId: id,
        fkPermissionId: 3,
      });
    });

    const newMessage = await Message.create({
      message: message.message,
      sendDate: message.sendDate,
      messageType: message.messageType,
      fkSenderId: message.fkSenderId,
    });

    await ChatMessage.create({
      fkChatId: newChat.id,
      fkMessageId: newMessage.id,
    });
    return { newConversationId: newChat.id, newMessage: newMessage.dataValues };
  } catch (e) {
    console.log({ e });
  }
};

module.exports = addChat;
