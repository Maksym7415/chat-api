const fs = require('fs');
const {
  ChatMessage, Message, User, File, sequelize,
} = require('../../../models');

let filesAmount = {}; // object with key=userId where files count from one message
let filesArray = {}; // object with key=userId of arrays of fileData from one message
const addChat = require('./addNewChatFunction');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('connection');
    socket.on('chats', async ({
      conversationId, message, userId, opponentId, messageId, isDeleteMessage,
    }, successCallback) => { // successCallback to inform client about sucessfull sending of message
      let isEdit = false;
      console.log(messageId, conversationId);

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
          return successCallback(true);
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
      } catch (error) {
        console.log(error);
        successCallback(false);
      }
    });

    socket.on('chatCreation', async (groupMembers, chatCreationTime, chatName, imageData, fileExtension, successCallback) => {
      try {
        const { newConversationId, newMessage } = await addChat({ sendDate: chatCreationTime }, 'Chat', groupMembers, chatName, imageData, fileExtension);
        if (!newMessage) {
          groupMembers.forEach(({ id }) => {
            io.emit(`userIdNewChat${id}`, {}, newConversationId);
          });
        }
        successCallback(true);
      } catch (e) {
        successCallback(false);
        console.log({ e });
      }
    });

    socket.on('files', async ({
      data, conversationId, fileSize, uniqueName, fileName, fileExtension, message, userId, isImage, filesCount, messageId, sendDate,
    }, successCallback) => {
      if (!data) {
        try {
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
          successCallback(newMessage.id);
        } catch (error) {
          successCallback('error');
        }
      } else {
        fs.appendFile(`./uploads/${uniqueName}.${fileExtension}`, data, async (err) => {
          if (err) return;

          if (!filesAmount[userId]) filesAmount[userId] = 1;
          else filesAmount[userId]++;

          try {
            const file = await File.create({
              fileStorageName: uniqueName,
              fileUserName: fileName,
              size: fileSize,
              extension: fileExtension,
              fkMessageId: messageId,
            });

            if (!filesArray[userId]) filesArray[userId] = [file.dataValues];
            else filesArray[userId] = [...filesArray[userId], file.dataValues];

            if (filesAmount[userId] === filesCount) {
              const user = await User.findOne(
                {
                  where: {
                    id: userId,
                  },
                },
              );
              successCallback('upload done');
              let requestMessage = {
                message,
                fkSenderId: userId,
                sendDate,
                messageType: 'File',
              };
              io.emit(`userIdChat${conversationId}`, {
                ...requestMessage, id: messageId, Files: filesArray[userId], User: user.dataValues,
              });
              filesAmount[userId] = 0;
              filesArray[userId] = [];
            }
            successCallback('file added');
          } catch (error) {
            successCallback(error);
            fs.unlink(`./uploads/${uniqueName}.${fileExtension}`, data, (err) => console.log(err));
          }
        });
      }
    });
    socket.on('typingState', (user, conversationId) => {
      io.emit(`typingStateId${conversationId}`, user);
    });
  });
};
