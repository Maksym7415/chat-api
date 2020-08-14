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
const initSocket = require('./src/api/socket');
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

app.use(errorHandling);

initSocket(fs, io, Message, ChatMessage, User);

module.exports = {
  app,
  http,
  // https
};
