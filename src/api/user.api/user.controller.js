const createError = require('http-errors');
const { User, Role } = require('../../../models');

module.exports = {
  getUserProfileData: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        include: {
          model: Role,
          through: {
            attributes: [],
          },
        },
      });
      if (user) {
        return res.json(user);
      }
      return res.status(400).json('no user found');
    } catch (error) {
      next(createError(501, error));
    }
  },
};
