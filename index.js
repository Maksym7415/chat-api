const {
  http,
} = require('./server');

require('dotenv').config();

const PORT = process.env.NODE_ENV === 'production' ? 5000 : process.env.PORT;

try {
  http.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
  });
  // throw "test";
} catch (error) {
  console.log(error);
  http.close();
}
