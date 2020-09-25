require('dotenv').config();
const {
  errorHandling,
} = require('./services/errorHandling');
const express = require('express');

const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/chat' });
const initSocket = require('./src/api/socket');

const routers = require('./src/api/routers');

const apiPath = process.env.NODE_ENV === 'production' ? '/chat/api' : '/api';
const uploadPath = process.env.NODE_ENV === 'production' ? '/chat' : '/';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// initSocket(io);

app.get(apiPath, (req, res) => res.send('Hello'));

app.use(uploadPath, express.static(path.join(__dirname, './uploads')));

app.use(apiPath, routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter, routers.searchRouter);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandling);

module.exports = {
  app,
  http,
};
