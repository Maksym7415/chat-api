/* eslint-disable no-undef */
let client = require('socket.io-client');
let io_server = require('socket.io').listen(8081);
const chatsSocket = require('../../../src/api/socket/chats.socket');

const setDays = (date) => {
  if (date) return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return date;
};

const setMonth = (date) => {
  if (date) return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return date;
};

const getCurrentDay = (value) => {
  if (setDays(value)) return setDays(value).split(':').map((d) => (d.length < 2 ? `0${d}` : d)).join(':');
  return '';
};

const getCurrentMonth = (value) => {
  if (setMonth(value)) return setMonth(value).split('-').map((d) => (d.length < 2 ? `0${d}` : d)).join('-');
  return '';
};

const fullDate = (value) => {
  if (setMonth(value)) return `${getCurrentMonth(value)} ${getCurrentDay(value)}`;
  return '';
};

describe('basic socket.io example', () => {
  let socket;
  let message;

  beforeEach((done) => {
    // Setup
    socket = client.connect('http://localhost:8081', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      done();
    });

    // socket.on('userIdChat7', (clientMessage) => {
    //   console.log(clientMessage);
    //   // message = clientMessage;
    //   done();
    // });

    socket.on('disconnect', () => {
      // console.log('disconnected...');
    });
  });

  afterEach((done) => {
    // Cleanup
    if (socket.connected) {
      socket.disconnect();
    }
    io_server.close();
    done();
  });

  it('should communicate', (done) => {
    // once connected, emit Hello World
    io_server.emit('chats', 'Hello World');
    // let sock;
    // io_server.on('connection', (socket) => {
    //   // eslint-disable-next-line no-unused-expressions
    //   sock = chatsSocket(io_server, socket);
    //   // expect(socket).to.not.be.null;
    // });

    // socket.emit('chats', ({
    //   conversationId: 7,
    //   message: {
    //     message: 'Hello World', fkSenderId: 1, sendDate: fullDate(new Date()), messageType: 'Text',
    //   },
    //   userId: 1,
    //   opponentId: 2,
    // }));
    // console.log(sock);

    // console.log(message);
    // done();

    socket.once('chats', (message) => {
      // Check that the message matches
      expect(message).toEqual('Hello World');
      done();
    });
  });
});
