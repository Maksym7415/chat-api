const { Subscriptions } = require('../../../models');

module.exports = async (userId) => {
  try {
    const subscriptions = await Subscriptions.findOne({
      where: {
        fkUserId: userId,
      },
    });
    if (!subscriptions) return [];
    return subscriptions;
  } catch (e) {
    console.log({ e });
  }
};
