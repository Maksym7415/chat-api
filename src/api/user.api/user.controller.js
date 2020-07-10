const models = require('../../../models');

module.exports = {
  signUp: async (req, res) => {
    const { firstName, lastName, login } = req.body;
    try {
      const isUser = await models.User.findOne({ where: { login } });
      console.log(isUser);
      if (!isUser) {
        const newUser = await models.User.create({
          firstName, lastName, login, status: 'free',
        });
        res.json({ data: newUser, status: 200, message: 'registration successful' });
      }
      res.json({ status: 400, message: 'such login already used in the system' });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
  signIn: async (req, res) => {
    const { login } = req.body;
    try {
      const isUser = await models.User.findOne({ where: { login } });
      if (isUser) {
        res.json({ data: isUser, status: 200, message: 'checkEmail' });
      }
      res.json({ status: 400, message: 'you need to registrate your account' });
    } catch (e) {
      res.json({ status: 501, message: e });
    }
  },
  // sendCheckCode: async (req, res) => {

  // },
};
