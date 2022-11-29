/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  ChatMessage,
} = require('../../../models');

module.exports = (io, socket) => socket.on('clearChat', async ({ ids }) => {
  for (let id of ids) {
    await ChatMessage.destroy({ where: { fkChatId: id } });
  }
  io.emit('clearChat', { ids });
});
