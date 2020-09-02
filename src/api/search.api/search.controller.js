const {
  User,
  Sequelize,
} = require('../../../models');

const { Op } = Sequelize;

module.exports = {
  getAllContact: async ({ token, query: { searchRequest } }, res) => {
    try {
      if (!searchRequest) {
        return res.json({ response: [] });
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
