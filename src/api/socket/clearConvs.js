const {
  ChatMessage,
} = require('../../../models');

module.exports = (io, socket) => socket.on('clearChat', async ({ id }) => {
  await ChatMessage.destroy({ where: { fkChatId: id } });
  io.emit('clearChat');
});
