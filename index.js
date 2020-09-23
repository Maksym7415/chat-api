const {
  app,
  http,
  // https
} = require('./server');

require('dotenv').config();


try {
  http.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
  // throw "test";
} catch (error) {
  console.log(error);
  http.close();
}

