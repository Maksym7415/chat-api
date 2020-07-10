require('dotenv').config();
const express = require('express');
const handleSendEmail = require('./src/helpers/nodeMailer');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routers = require('./src/api/routers');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routers.userRouters);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT, async () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
