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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

initSocket(io);

//
//
//
//

async function getMenuHtml(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const html = $.html();
    console.log($('*').text().trim().split('\n'));
    // console.log(html);
  } catch (error) {
    console.log(error);
  }
}

const vgmUrl = 'https://www.telegraafhotel.com/et/restoran-tallinnas/';
const errorLink = 'https://github.com';
const firstStageUrl = 'https://www.telegraafhotel.com/et/restoran-tallinnas/restoran-tchaikovsky-menuu/';

let entriesCounter = 0; // indicates deps of links stages
let nodesArray = []; // array of links in each stage
let targetHref = ''; // linl with menu
let isParsing = false; // indicates that link was found and started parsing process to prevent recurseve parsing

let resolve = () => console.log('init'); // resolving promise when reaches the last interation in array
let promiseCallback = (res) => () => res(); // saving promise in clousere to resolve it later
let promise = () => new Promise((res, rej) => {
  resolve = promiseCallback(res);
}); // promise for awaiting iteration process in nodesArray on each stage

async function getMenu(url, tag) {
  if (targetHref) return;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $(tag).each((i, element) => {
      if (targetHref) return;
      const { href } = element.attribs;
      if (!href) return;
      if (href.split('/')[2] !== url.split('/')[2]) return;
      const targetLink = element.children && element.children && element.children[0] && element.children[0].data;
      if (targetLink === 'Broneeri hoolitsus') {
        return targetHref = href;
      }
      nodesArray.push(href);
    });
    if (isParsing) return;
    // console.log(targetHref, entriesCounter);
    if (targetHref) {
      isParsing = true;
      console.log('I am ready to parse');
      return getMenuHtml(targetHref);
    }
    console.log(entriesCounter);
    if (entriesCounter >= 3) return; // (() => console.log('Nothing was found'))();
    entriesCounter++;
    if (entriesCounter > 1) await promise();
    if (isParsing) return;
    nodesArray.forEach((url, i) => {
      // console.log(i, nodesArray.length);
      getMenu(url, 'a');
      if (i === nodesArray.length - 1) {
        nodesArray = [];
        resolve();
      }
    });
    return;
  } catch (error) {
    console.log(error);
  }
}

getMenu(vgmUrl, 'a');
//
//
//
//

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
