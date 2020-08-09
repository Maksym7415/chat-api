require('dotenv').config();
const {
  errorHandling,
} = require('./services/errorHandling');
const express = require('express');

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

app.use('/api', routers.authRouters, routers.userRouters, routers.converSationRouters);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandling);

io.on('connection', (socket) => {
  console.log('connection');
  socket.on('chats', ({ conversationId, message }) => {
    console.log(conversationId);
    io.emit(`userIdChat${conversationId}`, message);
  });
});

module.exports = {
  app,
  http,
  // https
};
