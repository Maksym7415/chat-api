const io = require('socket.io');
const {
  httpServer,
  sockcetServer,
} = require('./server');
const initSocket = require('./src/api/socket');

require('dotenv').config();

const HTTP_PORT = process.env.NODE_ENV === 'production' ? 5000 : process.env.HTTP_PORT;
const { SOCKET_PORT } = process.env;

try {
  httpServer.listen(HTTP_PORT, async () => {
    console.log(`Listening on port ${HTTP_PORT}`);
  });
  sockcetServer.listen(SOCKET_PORT, () => {
    initSocket(io(sockcetServer, { path: '/chat', transports: ['websocket', 'polling'] }));
    console.log(`Listening on port ${SOCKET_PORT}`);
  });
} catch (error) {
  console.log(error);
  httpServer.close();
  sockcetServer.close();
}
