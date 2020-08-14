require('dotenv').config();
const {
  errorHandling,
} = require('./services/errorHandling');
const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
// const https = require('https');
// const io = require('socket.io')(https);
const io = require('socket.io')(http);
const {
  ChatMessage, Message, User,
} = require('./models');
const routers = require('./src/api/routers');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use('/', express.static(path.join(__dirname, './uploads')));

app.use('/api', routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandling);
let file = null;
io.on('connection', (socket) => {
  console.log('connection');
  socket.on('chats', async ({ conversationId, message, userId }, successCallback) => { // successCallback to inform client about sucessfull sending of message
    // if(message.type === 'file') {

    // }
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
  // socket.on('files', (file) => console.log(file));
  socket.on('files', ({
    data, sendDate, messageType, fkSenderId, conversationId, fileSize, isUploaded, uniqueName, fileName, fileExtension,
  }) => {
    // const id = uuid.v1();
    fs.appendFile(`./uploads/${uniqueName}.${fileExtension}`, data, async (err) => {
      if (err) console.log(err);
      // const message = await Message.create({
      //   message: id,
      //   sendDate,
      //   messageType,
      //   fkSenderId,
      // });
      // await ChatMessage.create({
      //   fkChatId: conversationId,
      //   fkMessageId: message.id,
      // });
    });
  });
});

module.exports = {
  app,
  http,
  // https
};
