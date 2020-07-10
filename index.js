const app = require('./server');
const http = require('http').createServer(app);
require('dotenv').config();

http.listen(process.env.PORT, async () => {
  console.log(`Listening on port ${process.env.PORT}`);
});