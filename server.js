require('dotenv').config();
const {
  errorHandling,
} = require('./services/errorHandling');
const express = require('express');

const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
// const https = require('https');
// const io = require('socket.io')(https);
const io = require('socket.io')(http);
const cheerio = require('cheerio');
const got = require('got');
const { default: Axios } = require('axios');
const initSocket = require('./src/api/socket');
const routers = require('./src/api/routers');
const parseProductDataFunction = require('./parseSpeciefiedProduct');
const getProductHrefs = require('./getProfuctHrefs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

initSocket(io);

//getProductHrefs().then((res) => {
// console.log(res);
// parseProductDataFunction();
//});

parseProductDataFunction();

app.use('/', express.static(path.join(__dirname, './uploads')));

app.use('/api', routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter, routers.searchRouter);

app.use('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandling);

module.exports = {
  app,
  http,
  // https,
};
