/* eslint-disable no-restricted-syntax */
module.exports = (strings, ...values) => {
  let obj = values[0];
  for (const key of strings[1].split('.')) {
    if (obj && key && typeof obj === 'object') {
      obj = obj[key];
    } else return undefined;
  }
  return obj;
};
