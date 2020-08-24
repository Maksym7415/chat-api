const fs = require('fs');
const {
  ChatMessage, Message, User, File,
} = require('../../../models');
const getFilesizeInBytes = require('../../helpers/checkFileSize');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    let fileIterationsCount = {}; // creating object for counter of filePortion iterations
    console.log('connection');
    socket.on('chats', async ({ conversationId, message, userId }, successCallback) => { // successCallback to inform client about sucessfull sending of message
      // if(message.type === 'file') {

      // }
      console.log(message);
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
      io.emit(`userIdChat${conversationId}`, { ...message, User: user });
      successCallback(true);
    });
    socket.on('files', ({
      data, sendDate, messageType, conversationId, fileSize, isUploaded, uniqueName, fileName, fileExtension, iterations, message, userId, isImage,
    }, successCallback) => {
      fs.appendFile(`./uploads/${uniqueName}.${fileExtension}`, data, async (err) => {
        if (err) return;
        if (!fileIterationsCount[uniqueName]) {
          fileIterationsCount[uniqueName] = 1;
        } else fileIterationsCount[uniqueName]++;
        if (iterations === fileIterationsCount[uniqueName]) { // checking if it's the last portion of file
          const internalFileSize = getFilesizeInBytes(`./uploads/${uniqueName}.${fileExtension}`);
          if (internalFileSize === fileSize) { // if we get not whole file we deleting it in other case we savin it in db
            // creating message
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
              const user = await User.findOne(
                {
                  where: {
                    id: userId,
                  },
                },
              );
              await File.create({
                fileStorageName: uniqueName,
                fileUserName: fileName,
                size: fileSize,
                extension: fileExtension,
                fkMessageId: newMessage.id,
              });

              fs.readFile(`./uploads/${uniqueName}.${fileExtension}`, (err, file) => {
                if (err) return;
                const fileData = {
                  file,
                  isImage,
                  fileName,
                };
                io.emit(`userIdChat${conversationId}`, { ...message, fileData, User: user.dataValues });
              });
            } catch (error) {
              console.log(error);
            }
          } else {
            fs.unlink(`./uploads/${uniqueName}.${fileExtension}`, (err) => {
              if (err) return;
            });
          }
        }
      });
    });
  });
};
