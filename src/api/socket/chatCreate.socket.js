const addChat = require('./addNewChatFunction');

module.exports = (io, socket) => socket.on('chatCreation', async (groupMembers, chatCreationTime, chatName, imageData, fileExtension, successCallback) => {
  try {
    const { newConversationId, newMessage } = await addChat({ sendDate: chatCreationTime }, 'Chat', groupMembers, chatName, imageData, fileExtension);
    if (!newMessage) {
      groupMembers.forEach(({ id }) => {
        io.emit(`userIdNewChat${id}`, {}, newConversationId);
      });
    }
    successCallback(true);
  } catch (e) {
    successCallback(false);
    console.log({ e });
  }
});
