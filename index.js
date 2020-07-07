const express = require('express');
const app = express();
const db = require('./models');

app.use('/', (req, res, next) => {
  next();
})

app.get('/', async (req, res) => {
  try{
    const result = await db.User.findAll({
      include: {
        model: db.UserRole,
      },
      
    })
    res.send(result)
  }catch(e){
    console.log({e})
  }
  
}) 

db.sequelize.sync().then(() => {
  app.listen(port = 8081, async () => {
    console.log(`Listening on port ${port}`);
  });
}).catch(() => console.log('Error'))
