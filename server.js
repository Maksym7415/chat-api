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
const vgmUrl = 'https://www.telegraafhotel.com/et/restoran-tallinnas/';

let array = [];
let exit;
let result;
let count = 0;

async function getMenu(url, tag) {
  if (result) return;
  count += 1;
  // console.log(count);
  try {
    const response = await got(url);
    const $ = cheerio.load(response.body);
    let nodesArray = [];
    $(tag).each((i, link) => {
      const { href } = link.attribs;
      nodesArray.push({
        node: link.childNodes,
        href,
      });
    });
    nodesArray.forEach((el) => {
      console.log(el.node[0].data);
      if (el.node[0].data === 'Please click here to see the cocktail menu!') {
        result = el.href;
      } else getMenu(el.href, 'a');
      // console.log(href);
    });
  } catch (error) {
    console.log(error);
  }
}

getMenu(vgmUrl, 'a');

// got(vgmUrl).then((response) => {
//   let $ = cheerio.load(response.body);
//   $('a').each((i, link) => {
//     const { href } = link.attribs;
//     if (href && href.includes('menuu')) {
//       console.log(href);
//       axios.get(href, { responseType: 'text' }).then((res) => {
//         // console.log(res);
//         let $ = cheerio.load(res, { decodeEntities: false });
//         $('div').each((i, link) => {
//           console.log('hello');
//           const divs = link.html();
//           if (divs) console.log(divs);
//         });
//         // fs.writeFile('./uploads/index.html', result.html(), () => {});
//       });
//     }
//   });
// }).catch((err) => {
//   console.log(err);
// });

// let TextElem = (e) => ({
//   toJSON: () => ({
//     type:
//       'TextElem',
//     textContent:
//       e.textContent,
//   }),
// });

// let Elem = (e) => ({
//   toJSON: () => ({
//     type:
//       'Elem',
//     tagName:
//       e.tagName,
//     attributes:
//       Array.from(e.attributes, ({ name, value }) => [name, value]),
//     children:
//       Array.from(e.childNodes, fromNode),
//   }),
// });

// // fromNode :: Node -> Elem
// var fromNode = (e) => {
//   switch (e.nodeType) {
//     case 3: return TextElem(e);
//     default: return Elem(e);
//   }
// };

// // html2json :: Node -> JSONString
// let html2json = (e) => JSON.stringify(Elem(e), null, '  ');

// let mainDiv = document.getElementsByClassName('content-formatted');
// html2json(mainDiv[1]);
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
