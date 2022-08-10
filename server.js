require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const routers = require('./src/api/routers');
const config = require('./config/urlConfig');

const {
  errorHandling,
} = require('./services/errorHandling');

const swaggerDocument = YAML.load('./swagger.yaml');
swaggerDocument.host = config.swaggerHost[process.env.NODE_ENV];
swaggerDocument.basePath = config.baseApiUrl[process.env.NODE_ENV];
swaggerDocument.schemes = config.swaggerScheme[process.env.NODE_ENV];

const app = express();
const httpServer = http.createServer(app);
const sockcetServer = http.createServer();

const apiPath = process.env.NODE_ENV === 'production' ? '/chat/api' : '/api';
const uploadPath = process.env.NODE_ENV === 'production' ? '/chat' : '/';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.get(apiPath, (req, res) => res.send('Hello'));

app.use(uploadPath, express.static(path.join(__dirname, './uploads')));

app.use(apiPath, routers.authRouters, routers.userRouters, routers.converSationRouters, routers.filesRouter, routers.searchRouter);

if (process.env.NODE_ENV !== 'production') {
  console.log('here');
  app.use(`${uploadPath}api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use('*', (req, res) => {
  // console.log(req);
  res.status(404).send('Page not found!');
});

app.use(errorHandling);

module.exports = {
  app,
  httpServer,
  sockcetServer,
};
