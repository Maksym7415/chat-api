/* eslint-disable no-await-in-loop */
/* eslint-disable no-multi-spaces */
/* eslint-disable no-restricted-syntax */
const {
  ChatMessage, Message, User, ChatUser, Conversation, File,
} = require('../../../models');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('connection');

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
        console.log('activity status was successfully changed');
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
        console.log(error, 'handshake fail');
        return socket.emit('handshake', 400);
      }
    });

    socket.on('message', async ({
      conversationId, message, userId, actionType, messageId,
    }, statusCallBack) => {
      try {
        let messageFiles = [];
        if (actionType === 'new') {
          const {
            sendDate, messageType, meta, ...msg
          } = message;
          const user = await User.findOne({
            where: {
              id: userId,
            },
          });
          const newMessage = await Message.create({
            ...msg, sendDate, sendDateMs: new Date(sendDate).getTime(), isEditing: false, fkSenderId: userId,
          });

          if (messageType === 'File') {
            for (const file of meta) {
              const newFile =  await File.create({
                fileStorageName: file.filePath,
                fileUserName: file.originalname,
                size: file.size,
                extension: file.extension,
                fkMessageId: newMessage.id,
              });
              messageFiles.push(newFile);
            }
          }
          await ChatMessage.create({
            fkChatId: conversationId,
            fkMessageId: newMessage.id,
          });
          io.in(`chat-${conversationId}`).emit('message', {
            message: {
              ...newMessage.dataValues, Files: messageFiles, User: user, // change isEdit to isEditing
            },
            conversationId,
            actionType,
          });
          console.log('message was send');
          statusCallBack(true, actionType);
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
          statusCallBack(true, actionType);
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
          statusCallBack(true);
        }
      } catch (error) {
        console.log(error, 'message send fail');
        io.in(`chat-${conversationId}`).emit('message', {
          error,
        });
        statusCallBack(false, actionType);
      }
    });

    socket.on('typing', ({ chatId, userName }) => {
      io.in(`chat-${chatId}`).emit('typing', { chatId, userName });
    });

    socket.on('roomConnect', async ({ //  chat creation
      chat: {
        conversationName, conversationType, conversationAvatar, conversationCreationDate,
      },
      message,
      userId,
      chatMembers, // array of user id
    }, successCallback) => {
      const users = [];
      try {
        const { sendDate, messageType, ...msg } = message;

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
        for (const id of [userId, ...chatMembers]) {
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
        console.log('new chat was successfully created');
        for await (const user of users) {
          io.to(user.socketId).emit('message', {
            message: {
              ...newMessage.dataValues, Files: [], User: users[0], // change isEdit to isEditing
            },
            conversationId: newChat.id,
            actionType: 'new',
          });
        }
        console.log('messages was successfully sended');
      } catch (error) {
        console.log(error, 'messages send fail');
        io.to(users[0].socketId).emit('message', {
          error,
        });
        successCallback(false);
      }
    });

    socket.on('roomDisconnected', async ({ chatName, userId }) => { // chat leaving
      socket.leave(chatName);
      await ChatUser.destroy({
        where: {
          fkUserId: userId,
        },
      });
      const usersCount = io.sockets.adapter.rooms.get('chatName').size;
      console.log('chats was successfully destroyed');
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
      console.log(`success disconnecting user - ${user.userName}`);
    });
  });
};
