const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = require('./models');

const tokenMiddleware = (token, msg) => {
  if(token.token)  return console.log(token, msg)
  throw Error;
}

app.use(cors())

app.use('/', (req, res, next) => {
  next();
})

// app.get('/socket', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

  io.on('connection', (socket) => {
    console.log('connection')
    socket.on('test', (msg) => {
      tokenMiddleware(socket.handshake.query, msg)
     
      io.emit('chat message', msg);
    }); 
  });

app.get('/', async (req, res) => {
  try{
    const result = await db.User.findAll({
      include: {
        model: db.Role,
        through: {
          attributes: []
        }     
      },
      
    })
    res.send(result)
  }catch(e){
    console.log({e})
  }
  
}) 

http.listen(port = 8081, async () => {
  console.log(`Listening on port ${port}`);
});
