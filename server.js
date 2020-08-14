/* eslint-disable no-plusplus */
require('dotenv').config();
const {
  errorHandling,
} = require('./services/errorHandling');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
// const https = require('https');
// const io = require('socket.io')(https);
const io = require('socket.io')(http);
const getFileSize = require('./src/helpers/checkFileSize');
const {
  ChatMessage, Message, User,
} = require('./models');
const routers = require('./src/api/routers');
const getFilesizeInBytes = require('./src/helpers/checkFileSize');

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

// app.use(errorHandling);
let file = null;
io.on('connection', (socket) => {
  let fileIterationsCount = {}; // creating object for counter of filePortion iterations
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
    data, sendDate, messageType, fkSenderId, conversationId, fileSize, isUploaded, uniqueName, fileName, fileExtension, iterations,
  }) => {
    fs.appendFile(`./uploads/${uniqueName}.${fileExtension}`, data, async (err) => {
      if (err) return;
      if (!fileIterationsCount[uniqueName]) {
        fileIterationsCount[uniqueName] = 1;
      } else fileIterationsCount[uniqueName]++;
      console.log(fileIterationsCount[uniqueName], iterations);

      if (iterations === fileIterationsCount[uniqueName]) { // checking if it's the last portion of file
        const internalFileSize = getFilesizeInBytes(`./uploads/${uniqueName}.${fileExtension}`);
        if (internalFileSize === fileSize) { // if we get not whole file we deleting it in other case we savin it in db
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
        } else {
          fs.unlink(`./uploads/${uniqueName}.${fileExtension}`, (err) => {
            if (err) return;
            console.log('File deleted!');
          });
        }
      }
    });
  });
});

module.exports = {
  app,
  http,
  // https
};
