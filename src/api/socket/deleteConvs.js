/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  Conversation, ChatMessage, ChatUser,
} = require('../../../models');

module.exports = (io, socket) => socket.on('deleteChat', async ({ ids }) => {
  for (let id of ids) {
    await ChatMessage.destroy({ where: { fkChatId: id } });
    await ChatUser.destroy({ where: { fkChatId: id } });
    await Conversation.destroy({ where: { id } });
  }

  io.emit('deleteChat', { ids });
});
