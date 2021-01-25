/* eslint-disable no-restricted-syntax */
const {
  ChatMessage, Message, User, ChatUser, Conversation,
} = require('../../../models');
const chats = require('./chats.socket');
const chatCreate = require('./chatCreate.socket');
const addFile = require('./addFiles.socket');
const handleIsTyping = require('./isTyping.socket');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('handshake', async (userId) => {
      const userChats = await Conversation.findAll({
        include: {
          model: User,
          where: {
            id: userId,
          },
        },
      });
      userChats.forEach((room) => {
        socket.join(`chat-${room.id}`);
      });
      console.log('join rooms');
    });

    socket.on('message', async ({
      conversationId, message, userId, actionType, messageId,
    }, successCallback) => {
      if (actionType === 'new') {
        const { sendDate, messageType, ...msg } = message;
        const user = await User.findOne({
          where: {
            id: userId,
          },
        });
        const newMessage = await Message.create({
          ...msg, sendDate, sendDateMs: new Date(sendDate).getTime(), isEditing: false, fkSenderId: userId,
        });
        await ChatMessage.create({
          fkChatId: conversationId,
          fkMessageId: newMessage.id,
        });
        io.in(`chat-${conversationId}`).emit('message', {
          message: {
            ...newMessage.dataValues, Files: [], User: user, // change isEdit to isEditing
          },
          conversationId,
          actionType,
        });
        successCallback(true, actionType);
      } else if (actionType === 'edit') {
        const { message: msg, sendDate } = message;
        await Message.update({
          message: msg,
          sendDate,
          sendDateMs: new Date(sendDate).getTime(),
        },
        {
          where: {
            id: messageId,
          },
        });
        io.in(`chat-${conversationId}`).emit('message', {
          message: { isEditing: true, message: msg, id: messageId },
          conversationId,
          actionType,
        });
        successCallback(true, actionType);
      } else {
        await Message.destroy(
          {
            where: {
              id: messageId,
            },
          },
        );
        io.in(`chat-${conversationId}`).emit('message', {
          message: { id: messageId },
          conversationId,
          actionType,
        });
        successCallback(true);
      }
    });

    socket.on('roomConnect', async (groupMembers, chatCreationTime, chatName, imageData, fileExtension, successCallback) => {
      console.log(groupMembers, chatCreationTime, chatName, imageData, fileExtension, successCallback);
      // const chat = await Conversation.create({
      //   conversationType: chatType,
      //   conversationCreationDate: createionTime,
      //   conversationName: name,
      // });
      // const user = await User.findOne({
      //   where: {
      //     id: message.senderId,
      //   },
      // });
      // for await (const user of users) {
      //   ChatUser.create({
      //     fkChatId: chat.id,
      //     fkUserId: user,
      //     fkPermissionId: 3,
      //   });
      // }

      // socket.join(`${chat.id}abc`);
      // io.in(`${chat.id}abc`).emit('message', {
      //   ...message, id: 454, Files: [], isEdit: false, User: user,
      // }, chat.id);
    });

    // console.log('connection');
    // chats(io, socket);

    // chatCreate(io, socket);

    // addFile(io, socket);

    // handleIsTyping(io, socket);
  });
};
