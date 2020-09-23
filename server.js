require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const {
  errorHandling,
} = require('./services/errorHandling');
const initSocket = require('./src/api/socket');

const routers = require('./src/api/routers');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

initSocket(io);

app.use('chat/', express.static(path.join(__dirname, './uploads')));

app.use('chat/api', routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter, routers.searchRouter);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandling);

module.exports = {
  app,
  http,
};
