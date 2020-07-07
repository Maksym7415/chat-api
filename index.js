const express = require('express');
const app = express();
const db = require('./models');
// const user = require('./models/user.js');
// const userRole = require('./models/userRole')
const models = require('./models/models');
const generateAssociatoins = require('./models/association');


console.log(db.sequelize.models, models)

app.use('/', (req, res, next) => {
  generateAssociatoins(models);
  next();
})

app.get('/', async (req, res) => {
  const result = await models.userTable.findAll({
    include: {
      model: models.userRoleTable,
  }
  })
  console.log(result)
  res.send(result)
}) 

db.sequelize.sync().then(() => {
  app.listen(port = 8081, async () => {
    console.log(`Listening on port ${port}`);
  });
}).catch(() => console.log('Error'))
