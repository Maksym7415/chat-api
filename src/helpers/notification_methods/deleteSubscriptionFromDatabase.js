const { Subscriptions } = require('../../../models');

module.exports = async (id) => {
  try {
    await Subscriptions.destroy({
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
