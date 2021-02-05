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
      conversationId, message, userId, actionType, messageId, opponentId,
    }, statusCallBack) => {
      try {
        let messageFiles = [];
        let newChat = {};
        let opponentUser = {};
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
          if (!conversationId) {
            opponentUser = await User.findOne({
              where: {
                id: opponentId,
              },
            });
            newChat = await Conversation.create({
              conversationName: null,
              conversationType: 'Dialog',
              conversationAvatar: null,
              conversationCreationDate: sendDate,
            });
            for (const id of [user.id, opponentId]) {
              await ChatUser.create({
                fkUserId: id,
                fkChatId: newChat.id,
                fkPermissionId: 3,
              });
            }
            await ChatMessage.create({
              fkChatId: newChat.id,
              fkMessageId: newMessage.id,
            });
            return io.to(user.socketId).to(opponentUser.socketId).emit('message', {
              message: {
                ...newMessage.dataValues, Files: messageFiles, User: user, // change isEdit to isEditing
              },
              conversationId: newChat.id,
              actionType,
            });
          }
          await ChatMessage.create({
            fkChatId: conversationId || newChat.id,
            fkMessageId: newMessage.id,
          });
          console.log(conversationId);
          io.in(`chat-${conversationId || newChat.id}`).emit('message', {
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

    socket.on('typing', (user, conversationId) => {
      io.in(`chat-${conversationId}`).emit('typing', { conversationId, user });
    });

    socket.on('roomConnect', async ({ //  chat creation
      chat: {
        chatName, conversationType, conversationAvatar, conversationCreationDate,
      },
      userId,
      groupMembers, // array of user id
    }, successCallback) => {
      const users = [];
      try {
        const newChat = await Conversation.create({
          conversationName: chatName,
          conversationType,
          conversationAvatar,
          conversationCreationDate,
        });
        for await (const id of [userId, ...groupMembers]) {
          const user = await User.findOne({
            where: {
              id,
            },
          });
          users.push(user);
        }
        for (const id of [userId, ...groupMembers]) {
          await ChatUser.create({
            fkChatId: newChat.id,
            fkUserId: id,
            fkPermissionId: 3,
          });
        }
        console.log('new chat was successfully created');
        for  (const user of users) {
          io.to(user.socketId).emit('roomConnect', { status: 'success', chatId: newChat.id });
        }
        console.log('messages was successfully sended');
        successCallback(true);
      } catch (error) {
        console.log(error, 'group creation fail');
        successCallback(false);
      }
    });

    socket.on(('isRoomConnected'), (roomId) => {
      socket.join(`chat-${roomId}`);
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
      console.log(user);
      socket.broadcast.emit('userDisconnected', user.id);
      console.log(`success disconnecting user - ${user.firstName}`);
    });
  });
};
