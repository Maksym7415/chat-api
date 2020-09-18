const fs = require('fs');
const uuid = require('uuid');
const {
  ChatMessage, Message, Conversation, ChatUser,
} = require('../../../models');

const addChat = async (message, chatType, chatUsers, chatName, imageData, fileExtension) => {
  try {
    let newMessage = {};
    let newChat = {};
    if (!chatName) {
      newChat = await Conversation.create({
        conversationType: chatType,
        conversationCreationDate: message.sendDate,
      });
    } else {
      const name = uuid.v1();
      let fullName;
      console.log(imageData);
      if (imageData) {
        fullName = `${name}.${fileExtension}`;
        fs.appendFile(`./uploads/${fullName}`, imageData, async (err) => {
          if (err) console.log('error');
        });
      }
      fullName = null;
      newChat = await Conversation.create({
        conversationType: chatType,
        conversationCreationDate: message.sendDate,
        conversationName: chatName,
        conversationAvatar: fullName,
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
        isEditing: false,
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
