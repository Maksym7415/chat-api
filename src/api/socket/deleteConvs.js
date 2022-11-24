const {
  Conversation, ChatMessage, ChatUser,
} = require('../../../models');

module.exports = (io, socket) => socket.on('deleteChat', async ({ id }) => {
  await ChatMessage.destroy({ where: { fkChatId: id } });
  await ChatUser.destroy({ where: { fkChatId: id } });
  await Conversation.destroy({ where: { id } });
  io.emit('deleteChat');
});
