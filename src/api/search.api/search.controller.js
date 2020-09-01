const {
  User,
  Sequelize,
} = require('../../../models');

const { Op } = Sequelize;

module.exports = {
  getAllContact: async ({ query: { searchRequest } }, res) => {
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
            [Op.not]: 11,
          },
        },
      });
      return res.json({ response: contacts });
    } catch (e) {
      console.log({ e });
    }
  },
};
