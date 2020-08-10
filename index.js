const {
  app,
  http,
  // https
} = require('./server');
// const socketAppConnection = require('./socket.server');
// const crypto = require('crypto-js');
// const fs = require('fs');
// const http = require('http').createServer(app);
require('dotenv').config();

// socketAppConnection();
// const options = {
//   key: fs.readFileSync('keys/privatekey.pem').toString(),
//   cert: fs.readFileSync('keys/certificate.pem').toString()
// };

// https.createServer(options, app).listen(process.env.PORT, async () => {
//       console.log(`Listening on port ${process.env.PORT}`);
//   });

try {
  http.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
  // throw "test";
} catch (error) {
  console.log(error);
  http.close();
}

// THIS CODE FOR SERVER

// const fs = require('fs');

// let subdomain = 'test'

// let socketPath = `/home/asmer/node_hosts/${subdomain}` //путь к сокету

// const {
//   app,
//   http,
//   // https
// } = require('./server');
// // const socketAppConnection = require('./socket.server');
// // const crypto = require('crypto-js');
// // const fs = require('fs');
// // const http = require('http').createServer(app);
// require('dotenv').config();

// // socketAppConnection();
// // const options = {
// //   key: fs.readFileSync('keys/privatekey.pem').toString(),
// //   cert: fs.readFileSync('keys/certificate.pem').toString()
// // };

// // https.createServer(options, app).listen(process.env.PORT, async () => {
// //       console.log(`Listening on port ${process.env.PORT}`);
// //   });

// try {
//   http.listen(socketPath, () => {
//     console.log(`Now listening on ${socketPath}`)
//     fs.chmodSync(socketPath, '777'); //права доступа к файлу сокета
//   });
// } catch (error) {
//   console.log(error);
//   http.close();
// }
