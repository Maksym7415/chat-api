const {
  Contact,
  Sequelize,
} = require('../../../models');

const { Op } = Sequelize;

module.exports = {
  getAllContact: async ({ query: { searchRequest } }, res) => {
    try {
      if (!searchRequest) {
        return res.json({ response: [] });
      }
      const contacts = await Contact.findAll({
        where: {
          pseudonyme: {
            [Op.substring]: searchRequest,
          },

        },
      });
      return res.json({ response: contacts });
    } catch (e) {
      console.log({ e });
    }
  },
};
