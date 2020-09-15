const createError = require('http-errors');
const { User, Role, Avatar } = require('../../../models');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../../services/errorHandling');

module.exports = {
  getUserProfileData: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: {
          exclude: ['verificationCode'],
        },
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
      next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_EXISTS, 'User not found')));
      // return res.status(400).json('no user found');
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
      // next(createError(501, error));
    }
  },
  setMainUserPhoto: async ({ path, query }, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: path.userId,
        },
      });
      const oldAvatar = user.userAvatar;
      await User.update({
        userAvatar: query.url,
      });
      await Avatar.destroy({
        where: {
          id: path.photoId,
        },
      });
      await Avatar.create({
        fileName: oldAvatar,
        fkUserId: path.userId,
        defaultAvatar: true,
      });
      return res.status(200).json({ message: 'success' });
    } catch (e) {
      console.log({ e });
    }
  },
};
