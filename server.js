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
// const https = require('https');
// const io = require('socket.io')(https);
const io = require('socket.io')(http);
let fs = require('fs');
let PDFParser = require('pdf2json');
const initSocket = require('./src/api/socket');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

initSocket(io);

//
const pdf = require('./uploads/F1040EZ.json');

const textArr = [];
pdf.pages[1].texts.map((el) => {
  // console.log(/[^ ]/.test(el.text));
  if (/[^ ]/.test(el.text)) {
    return textArr.push({
      text: el.text,
    });
  }
});
console.log(textArr);
// let pdfParser = require('pdf-parser');
const routers = require('./src/api/routers');

// let PDF_PATH = './2019-Suvi-RUS.pdf';

// pdfParser.pdf2json(PDF_PATH, (error, pdf) => {
//   if (error != null) {
//     console.log(error);
//   } else {
//     fs.writeFile('./uploads/F1040EZ.json', JSON.stringify(pdf), () => {});
//   }
// });
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
