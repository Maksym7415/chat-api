const webpush = require('web-push');
const deleteSubscriptionFromDatabase = require('./deleteSubscriptionFromDatabase');

const options = {
  // gcmAPIKey: 'NOT IN USE',
  TTL: 60,
  vapidDetails: {
    subject: 'mailto:web-push-book@vit91112@gmail.com',
    publicKey: 'BP-HmCF4giJVZkWsxilER7S0_YDijywpvS7Q-1XrXDVQzbmZFzWFlr_MT2-rpO0kBZ_6A8yMDyOaa0gi29wdaMg',
    privateKey: 'A86Lwz9JfsaWMeo8lQeKbaqnoMjMCoKh5flBj8KckG8',
  },
  contentEncoding: 'aes128gcm',
};

module.exports = ({ subscription, id }, dataToSend) => webpush.sendNotification(JSON.parse(subscription), JSON.stringify(dataToSend), options)
  .catch((err) => {
    console.log({ err });
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid: ', err);
      return deleteSubscriptionFromDatabase(id);
    }
    throw err;
  });
