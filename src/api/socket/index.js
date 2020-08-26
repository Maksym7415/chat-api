const fs = require('fs');
const util = require('util');
const {
  ChatMessage, Message, User, File,
} = require('../../../models');
const getFilesizeInBytes = require('../../helpers/checkFileSize');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    let fileIterationsCount = {}; // creating object for counter of filePortion iterations
    let filesAmount = {}; // object with key=userId where files count from one message
    let filesArray = {}; // object with key=userId of arrays of fileData from one message
    const appendFileAsync = util.promisify(fs.appendFile);
    console.log('connection');
    socket.on('chats', async ({ conversationId, message, userId }, successCallback) => { // successCallback to inform client about sucessfull sending of message
      // if(message.type === 'file') {

      // }
      console.log(message);
      if (!message) return successCallback(false);
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
        io.emit(`userIdChat${conversationId}`, {
          ...message, id: newMessage.id, fileData: [], User: user,
        });
        successCallback(true);
      } catch (error) {
        successCallback(false);
      }
    });
    socket.on('files', async ({
      data, conversationId, fileSize, uniqueName, fileName, fileExtension, iterations, message, userId, isImage, filesCount,
    }, successCallback) => {
      fs.appendFile(`./uploads/${uniqueName}.${fileExtension}`, data, async (err) => {
        if (err) return;

        if (!fileIterationsCount[uniqueName]) {
          fileIterationsCount[uniqueName] = 1;
        } else fileIterationsCount[uniqueName]++; // creating object of iterations by unique name of file to control if whole file parts received from client

        if (iterations === fileIterationsCount[uniqueName]) { // checking if it's the last portion of file
          // setting count +1 and adding fileData object in filesArray when got whole file
          if (!filesAmount[userId]) filesAmount[userId] = 1;
          else filesAmount[userId]++;
          if (!filesArray[userId]) filesArray[userId] = [{ isImage, name: `${uniqueName}.${fileExtension}` }];
          else filesArray[userId] = [...filesArray[userId], { isImage, name: `${uniqueName}.${fileExtension}` }];

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

              console.log(internalFileSize === fileSize);

              if (filesAmount[userId] === filesCount) {
                filesAmount[userId] = 0;
                successCallback(true);
                io.emit(`userIdChat${conversationId}`, {
                  ...message, id: newMessage.id, fileData: filesArray[userId], User: user.dataValues,
                });
                filesArray[userId] = [];
              }
            } catch (error) {
              successCallback(false);
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
