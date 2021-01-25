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
      if (!userId) {
        console.log('handshake fail');
        return socket.emit('handshake', 400);
      }
      try {
        const user = await User.findOne({
          where: {
            id: userId,
          },
        });
        if (!user) {
          console.log('handshake fail');
          return socket.emit('handshake', 400);
        }
        user.socketId = socket.id;
        user.activityStatus = 'online';
        await user.save();
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
        console.log('handshake success');
        return socket.broadcast.emit('userConnected', userId);
      } catch (error) {
        console.log(error);
        return socket.emit('handshake', 400);
      }
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
        const { message: msg } = message;
        await Message.update({
          message: msg,
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

    socket.on('roomConnect', async ({
      chat: {
        conversationName, conversationType, conversationAvatar, conversationCreationDate,
      },
      message,
      userId,
      chatMembers, // array of user id
    }, successCallback) => {
      try {
        const { sendDate, messageType, ...msg } = message;
        const users = [];
        const newChat = await Conversation.create({
          conversationName,
          conversationType,
          conversationAvatar,
          conversationCreationDate,
        });
        for await (const id of [userId, ...chatMembers]) {
          const user = await User.findOne({
            where: {
              id,
            },
          });
          users.push(user);
        }
        for await (const id of [userId, ...chatMembers]) {
          await ChatUser.create({
            fkChatId: newChat.id,
            fkUserId: id,
            fkPermissionId: 3,
          });
        }
        const newMessage = await Message.create({
          ...msg, sendDate, sendDateMs: new Date(sendDate).getTime(), isEditing: false, fkSenderId: userId,
        });
        await ChatMessage.create({
          fkMessageId: newMessage.id,
          fkChatId: newChat.id,
        });
        for await (const user of users) {
          io.to(user.socketId).emit('message', {
            message: {
              ...newMessage.dataValues, Files: [], User: users[0], // change isEdit to isEditing
            },
            conversationId: newChat.id,
            actionType: 'new',
          });
        }
      } catch (error) {
        console.log(error);
        successCallback(false);
      }
    });

    socket.on('roomDisconnected', async ({ chatName, userId }) => {
      socket.leave(chatName);
      await ChatUser.destroy({
        where: {
          fkUserId: userId,
        },
      });
      const usersCount = io.sockets.adapter.rooms.get('chatName').size;
      io.in(chatName).emit('roomDisconnected', usersCount);
    });

    socket.on('disconnect', async () => {
      const user = await User.findOne({
        where: {
          socketId: socket.id,
        },
      });
      if (!user) return;
      user.activityStatus = 'offline';
      await user.save();
      socket.broadcast.emit('userDisconnected', user.id);
      console.log(`success ${user.userName}  disconnecting`);
    });

    // console.log('connection');
    // chats(io, socket);

    // chatCreate(io, socket);

    // addFile(io, socket);

    // handleIsTyping(io, socket);
  });
};
