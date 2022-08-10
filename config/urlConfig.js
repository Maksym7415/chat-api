const config = {
  httpPort: {
    development: 8081,
    docker: 8081,
  },
  baseApiUrl: {
    development: '/api',
    docker: '/api',
  },
  baseUrl: {
    development: '',
    docker: '',
  },
  swaggerHost: {
    development: 'localhost:8081',
    docker: 'localhost:8081',
  },
  swaggerScheme: {
    development: 'http',
    docker: 'http',
  },
};

module.exports = config;
