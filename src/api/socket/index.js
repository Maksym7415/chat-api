const chats = require('./chats.socket');
const chatCreate = require('./chatCreate.socket');
const addFile = require('./addFiles.socket');
const handleIsTyping = require('./isTyping.socket');
const deleteConvs = require('./deleteConvs');
const clearConvs = require('./clearConvs');

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('connection');
    chats(io, socket);

    chatCreate(io, socket);

    addFile(io, socket);

    handleIsTyping(io, socket);

    deleteConvs(io, socket);

    clearConvs(io, socket);
  });
};
