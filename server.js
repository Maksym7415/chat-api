require('dotenv').config();
const {
  errorHandling,
} = require('./services/errorHandling');
const express = require('express');
const {
  ChatMessage, Message, Conversation, ChatUser, User,
} = require('./models');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
// const https = require('https');
// const io = require('socket.io')(https);
const io = require('socket.io')(http);
const routers = require('./src/api/routers');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use('/api', routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

// app.use(errorHandling);

io.on('connection', (socket) => {
  console.log('connection');
  socket.on('chats', async ({ conversationId, message, userId }, successCallback) => { // successCallback to inform client about sucessfull sending of message
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
    // const { Conversations: conversation } = await User.findOne(
    //   {
    //     where: {
    //       id: userId,
    //     },
    //     include: {
    //       model: Conversation,
    //     },
    //   },
    // );
    // conversation.forEach((el) => {
    // io.emit(`userIdChat${el.id}`, message);
    // });
    io.emit(`userIdChat${conversationId}`, { ...message, User: user });
    successCallback(true);
  });
});

module.exports = {
  app,
  http,
  // https
};
