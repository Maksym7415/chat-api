module.exports = (io, socket) => socket.on('typingState', (user, conversationId) => {
  io.emit(`typingStateId${conversationId}`, user);
});
