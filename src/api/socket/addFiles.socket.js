const fs = require('fs');
const {
  ChatMessage, Message, User, File,
} = require('../../../models');

let filesAmount = {}; // object with key=userId where files count from one message
let filesArray = {}; // object with key=userId of arrays of fileData from one message

module.exports = (io, socket) => socket.on('files', async ({
  data, conversationId, fileSize, uniqueName, fileName, fileExtension, message, userId, isImage, filesCount, messageId, sendDate,
}, successCallback) => {
  if (!data) {
    try {
      const newMessage = await Message.create({
        message: message.message,
        sendDate: message.sendDate,
        messageType: message.messageType,
        fkSenderId: message.fkSenderId,
        isEditing: message.isEditing,
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
