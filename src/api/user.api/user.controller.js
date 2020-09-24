const createError = require('http-errors');
const { User, Role, Avatar, Subscriptions } = require('../../../models');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../../services/errorHandling');
const qs = require('qs')

const webpush = require('web-push');

// const vapidKeys = {
//   publicKey:
//   'BP-HmCF4giJVZkWsxilER7S0_YDijywpvS7Q-1XrXDVQzbmZFzWFlr_MT2-rpO0kBZ_6A8yMDyOaa0gi29wdaMg',
//   privateKey: 'A86Lwz9JfsaWMeo8lQeKbaqnoMjMCoKh5flBj8KckG8'
// };

const options = {
  //gcmAPIKey: 'NOT IN USE',
  TTL: 60,
  vapidDetails: {
      subject: 'mailto:web-push-book@vit91112@gmail.com',
      publicKey: 'BP-HmCF4giJVZkWsxilER7S0_YDijywpvS7Q-1XrXDVQzbmZFzWFlr_MT2-rpO0kBZ_6A8yMDyOaa0gi29wdaMg',
      privateKey: 'A86Lwz9JfsaWMeo8lQeKbaqnoMjMCoKh5flBj8KckG8'
    },
    contentEncoding: 'aes128gcm'
};

// webpush.setVapidDetails(
//   'mailto:web-push-book@vit91112@gmail.com',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return false;
  }
  return true;
};

async function saveSubscriptionToDatabase(subscription) {
  try{
    const id = await Subscriptions.create({subscription: JSON.stringify(subscription), fkUserId: 1})
    return id
  }catch(e){
    console.log({e})
  }
};

async function getSubscriptionsFromDatabase() {
  try{
    const subscriptions = await Subscriptions.findAll()
    return subscriptions
  }catch(e){
    console.log({e})
  }
}

const triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(JSON.parse(subscription), 'success', options)
  .catch((err) => {
    console.log({err})
    // if (err.statusCode === 404 || err.statusCode === 410) {
    //   console.log('Subscription has expired or is no longer valid: ', err);
    //   return deleteSubscriptionFromDatabase(subscription._id);
    // } else {
    //   throw err;
    // }
  });
};

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
    token, body: { firstName, lastName, tagName },
  }, res, next) => {
    console.log('FIRSTNAME', firstName);
    if (!firstName && !lastName && !tagName) return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION)));
    try {
      await User.update({
        firstName,
        lastName,
        tagName,
      }, {
        where: {
          id: token.userId,
        },
      });
      return res.status(200).json({ message: 'success' });
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
    try{
     if(!isValidSaveRequest(req, res)) return;

      console.log(req.body)

      return saveSubscriptionToDatabase(req.body)
      .then(function(subscriptionId) {
        res.status(200).json({ data: { success: true } });
      })
    }catch(e) {
      res.status(500).json({
        error: {
          id: 'unable-to-save-subscription',
          message: 'The subscription was received but we were unable to save it to our database.'
        }
      })
    }
  },
  pushSubscription: async (req, res) => {
    try{
        const subscriptions = await getSubscriptionsFromDatabase();
        let promiseChain = Promise.resolve();
        for (let i = 0; i < subscriptions.length; i++) {
          const {subscription} = subscriptions[i];
          promiseChain = promiseChain.then( async () => {
            try{
              setTimeout(async () => await triggerPushMsg(subscription, {msg: 'privet'}), 1000)
              return res.status(200).json({ data: { success: true }})
            }catch(err) {
              return res.status(500).json({
                error: {
                  id: 'unable-to-send-messages',
                  message: `We were unable to send messages to all subscriptions : ` +
                    `'${err.message}'`
                }
              });
            }         
                 
        })
      }
  //     return getSubscriptionsFromDatabase()
  //     .then(function(subscriptions) {
  //     let promiseChain = Promise.resolve();

  //     for (let i = 0; i < subscriptions.length; i++) {
        
  //       const {subscription} = subscriptions[i];
  //       promiseChain = promiseChain.then(() => {
  //         return triggerPushMsg(subscription, {msg: 'privet'});
  //       }).then(() => {
  //         console.log(325434534564, subscriptions.length)
  //        return res.status(200).json({ data: { success: true }})
  //     })
  //     .catch(function(err) {
  //       console.log('dgdfgdfgdfgdfgd', err)
  //       return res.status(500).json({
  //         error: {
  //           id: 'unable-to-send-messages',
  //           message: `We were unable to send messages to all subscriptions : ` +
  //             `'${err.message}'`
  //         }
  //       });
  //     });
  //     }

  //     return promiseChain;
  // })
    }catch(e) {

    }
  }
};
