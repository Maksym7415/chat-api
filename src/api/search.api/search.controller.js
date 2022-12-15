const {
  User,
  Sequelize,
} = require('../../../models');

const { Op } = Sequelize;

module.exports = {
  getAllContact: async ({ token, query: { searchRequest, offset, limit = 20 } }, res) => {
    try {
      if (!searchRequest) {
        const allContacts = await User.findAll(({
          where: {
            id: {
              [Op.not]: token.userId,
            },
          },
          limit,
          offset,
        }));
        return res.json({ response: allContacts, offset, limit });
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
        limit,
        offset,
      });
      return res.json({ response: contacts, offset, limit });
    } catch (e) {
      console.log({ e });
    }
  },
};
