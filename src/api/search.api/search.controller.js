const {
  User,
  Sequelize,
} = require('../../../models');

const { Op } = Sequelize;

module.exports = {
  getAllContact: async ({ token, query: { searchRequest } }, res) => {
    try {
      if (!searchRequest) {
        const allContacts = await User.findAll(({
          where: {
            id: {
              [Op.not]: token.userId,
            },
          },
        }));
        return res.json({ response: allContacts });
      }
      const contacts = await User.findAll({
        where: {
          firstName: {
            [Op.substring]: searchRequest,
          },
          id: {
            [Op.not]: token.userId,
          },
        },
      });
      return res.json({ response: contacts });
    } catch (e) {
      console.log({ e });
    }
  },
};
