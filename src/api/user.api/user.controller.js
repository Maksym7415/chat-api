const createError = require('http-errors');
const {
  User, Role, Avatar,
} = require('../../../models');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../../services/errorHandling');
const isValidSaveNotificationRequest = require('../../helpers/notification_methods/isValidSaveNotificationRequest');
const saveSubscriptionToDatabase = require('../../helpers/notification_methods/saveSubscriptionToDatabase');

module.exports = {
  getUserProfileData: async ({ token }, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: token.userId },
        attributes: {
          exclude: ['verificationCode', 'status', 'userCreationTime', 'userUpdateTime'],
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

  getUserProfileById: async ({ params }, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: params.id },
        attributes: {
          exclude: ['verificationCode', 'status', 'userCreationTime', 'userUpdateTime'],
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
      console.log(error);
      next(createError(formErrorObject(MAIN_ERROR_CODES.UNHANDLED_ERROR)));
      // next(createError(501, error));
    }
  },

  updateUserProfile: async ({
    token, body: {
      firstName, lastName, tagName, lang,
    },
  }, res, next) => {
    if (!firstName && !lastName && !tagName && !lang) return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION)));
    try {
      await User.update({
        firstName,
        lastName,
        tagName,
        lang,
        fullName: `${firstName} ${lastName}`,
      }, {
        where: {
          id: token.userId,
        },
      });
      return res.status(204).send();
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR)));
    }
  },

  setMainUserPhoto: async ({ token, params, query }, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: token.userId,
        },
      });
      const oldAvatar = user.userAvatar;
      await User.update({
        userAvatar: query.url,
      }, {
        where: {
          id: token.userId,
        },
      });
      await Avatar.destroy({
        where: {
          id: params.photoId,
        },
      });
      await Avatar.create({
        fileName: oldAvatar,
        fkUserId: token.userId,
        defaultAvatar: false,
      });
      return res.status(200).json({ message: 'success' });
    } catch (e) {
      console.log({ e }); // нужно дописать ))
    }
  },

  getUserAvatars: async ({ token }, res) => {
    try {
      const avatars = await Avatar.findAll({
        where: {
          fkUserId: token.userId,
        },
      });
      const { userAvatar, id } = await User.findOne({
        where: {
          id: token.userId,
        },
      });
      if (!userAvatar) return res.status(200).json([]); // !!!!
      return res.status(200).json(
        [{
          id: 0, fileName: userAvatar, defaultAvatar: true, fkUserId: id,
        }, ...avatars],
      );
    } catch (e) {
      console.log({ e }); // нужно дописать ))
    }
  },
  signNotification: async (req, res) => {
    try {
      if (!isValidSaveNotificationRequest(req, res)) return;
      console.log(req.body);
      return saveSubscriptionToDatabase(req.body, req.params.id)
        .then((subscriptionId) => {
          if (subscriptionId) return res.status(200).json({ data: { success: true } });
          return res.status(200).json({ data: { success: 'such subscription have been added before' } });
        });
    } catch (e) {
      res.status(500).json({
        error: {
          id: 'unable-to-save-subscription',
          message: 'The subscription was received but we were unable to save it to our database.',
        },
      });
    }
  },

  deleteUserAvatar: async ({ params, token }, res, next) => {
    try {
      if (params.id) {
        await Avatar.destroy({ where: { id: params.id } });
      } else {
        await User.update({
          userAvatar: '',
        }, {
          where: {
            id: token.userId,
          },
        });
      }
      return res.status(204);
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR)));
    }
  },

  checkEmails: async ({ body }, res, next) => {
    try {
      const result = await Promise.allSettled(body.emails.map((email) => User.findOne({ where: { login: email } })));
      console.log(result);
      return res.status(200).json(result.filter((item) => item.value).map((item) => item.value));
    } catch (error) {
      next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR)));
    }
  },

};
