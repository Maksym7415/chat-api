const fs = require('fs');
const {
  ChatMessage, Message, User, File, Conversation,
} = require('../../../models');
const chatsSocket = require('./chats.socket');

let filesAmount = {}; // object with key=userId where files count from one message
let filesArray = {}; // object with key=userId of arrays of fileData from one message
const addChat = require('./addNewChatFunction');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('connection');
    // socket.on('chats', async ({
    //   conversationId, message, userId, opponentId,
    // }, successCallback) => { // successCallback to inform client about sucessfull sending of message
    //   if (!message) return successCallback(false);
    //   try {
    //     if (!conversationId) {
    //       const user = await User.findOne({
    //         where: {
    //           id: userId,
    //         },
    //       });
    //       const opponent = await User.findOne({
    //         where: {
    //           id: opponentId,
    //         },
    //       });
    //       const { newConversationId, newMessage } = await addChat(opponentId, message, 'Dialog', [user, opponent]);
    //       console.log(newConversationId, newMessage);
    //       io.emit(`userIdNewChat${userId}`, { ...newMessage, User: user }, newConversationId);
    //       return io.emit(`userIdNewChat${opponentId}`, { ...newMessage, User: user }, newConversationId);
    //     }
    //     const newMessage = await Message.create({
    //       message: message.message,
    //       sendDate: message.sendDate,
    //       messageType: message.messageType,
    //       fkSenderId: message.fkSenderId,
    //     });
    //     await ChatMessage.create({
    //       fkChatId: conversationId,
    //       fkMessageId: newMessage.id,
    //     });
    //     const user = await User.findOne(
    //       {
    //         where: {
    //           id: userId,
    //         },
    //       },
    //     );
    //     io.emit(`userIdChat${conversationId}`, {
    //       ...message, id: newMessage.id, Files: [], User: user,
    //     });
    //     successCallback(true);
    //   } catch (error) {
    //     successCallback(false);
    //   }
    // });
    chatsSocket(io, socket);
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

// const vgmUrl = 'https://www.telegraafhotel.com/et/restoran-tallinnas/';

// let hrefArray = [];
// let exit;
// let result;
// let prevUrl = 'https://www.telegraafhotel.com/et/restoran-tallinnas/';
// let count = -1;
// let hrefCount = 0;

// async function getMenu(url, tag, isRecursive) {
//   if (isRecursive) count = -1;
//   count += 1;
//   hrefArray = [];
//   try {
//     const response = await got(url);
//     const $ = cheerio.load(response.body);
//     let nodesArray = [];
//     $(tag).each((i, link) => {
//       const { href } = link.attribs;
//       nodesArray.push({
//         node: link.childNodes,
//         href,
//       });
//     });
//     nodesArray.forEach((el) => {
//       // console.log(el.node[0].data);
//       if (el.node[0] && el.node[0].data === 'Sviidid') {
//         result = el.href;
//       } else {
//         el.href && el.href !== '#' && hrefArray.push(el.href);
//         // prevUrl = hrefArray[hrefCount];
//       }
//     });
//     console.log(result);
//     if (result) {
//       console.log(result);
//       return;
//     }
//     // console.log(count, prevUrl, hrefArray);
//     // const prevHrefArray = hrefArray.filter((el) => el.substr(0, 8) === 'https://');
//     const prevHrefArray = hrefArray.filter((el) => el.split('/')[2] === 'www.telegraafhotel.com');
//     if (count >= 1) {
//       hrefCount += 1;
//       getMenu(prevUrl, 'a', true);
//       return;
//     }
//     // console.log(hrefCount, prevUrl, );
//     console.log(prevHrefArray[hrefCount]);
//     if(prevHrefArray.length - 1 === hrefCount) return console.log('not found')
//     getMenu(prevHrefArray[hrefCount], 'a', false);
//     return;
//   } catch (error) {
//     console.log(error);
//   }
// }

// getMenu(vgmUrl, 'a');
