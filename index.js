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
