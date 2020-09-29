const { Subscriptions } = require('../../../models');

module.exports = async (subscription, userId) => {
  try {
    const isSubscription = await Subscriptions.findOne({
      where: {
        subscription: JSON.stringify(subscription),
      },
    });
    if (isSubscription) return;
    const id = await Subscriptions.create({ subscription: JSON.stringify(subscription), fkUserId: userId });
    return id;
  } catch (e) {
    console.log({ e });
  }
};
