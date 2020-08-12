const { Message, ChatMessage } = require('../../../models');

module.exports = {
  addFiles: async (req, res, next) => {
    console.log(req.body.userId);
    // try{
    //   const file = await Message.create({
    //     message: message.message,
    //     sendDate: message.sendDate,
    //     messageType: message.messageType,
    //     fkSenderId: message.fkSenderId,
    //   });
    //   await ChatMessage.create({
    //     fkChatId: conversationId,
    //     fkMessageId: newMessage.id,
    //   });
    //   return  res.status(200).json('ok');
    // }catch(e){

    // }
  },
};
