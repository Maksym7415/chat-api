require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const routers = require('./src/api/routers');

const {
  errorHandling,
} = require('./services/errorHandling');

const app = express();
const httpServer = http.createServer(app);
const socketServer = http.createServer();

const apiPath = process.env.NODE_ENV === 'production' ? '/chat/api' : '/api';
const uploadPath = process.env.NODE_ENV === 'production' ? '/chat' : '/';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.get(apiPath, (req, res) => res.send('Hello'));

app.use(uploadPath, express.static(path.join(__dirname, './uploads')));

app.use(apiPath, routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter, routers.searchRouter);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandling);

module.exports = {
  app,
  httpServer,
  socketServer,
};
