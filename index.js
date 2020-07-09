const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = require('./models');

app.use(cors())

app.use('/', (req, res, next) => {
  next();
})

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
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
