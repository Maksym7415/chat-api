// const { http } = require('./server');
// const { Message, ChatMessage } = require('./models');
// const io = require('socket.io')(http);

// const socketAppConnection = () => {
//   io.on('connection', (socket) => {
//     console.log('connection');
//     socket.on('chats', async ({ conversationId, message, userId }) => {
//       const newMessage = await Message.create({
//         message: message.message,
//         sendDate: message.sendDate,
//         messageType: message.messageType,
//         fkSenderId: message.fkSenderId,
//       });
//       await ChatMessage.create({
//         fkChatId: conversationId,
//         fkMessageId: newMessage.id,
//       });
//       io.emit(`userIdChat${conversationId}`, message);
//     });
//   });
// };

// module.exports = socketAppConnection;
