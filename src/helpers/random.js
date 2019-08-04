const crypto = require('crypto');
const biformat = require('biguint-format');

const randomInt = (length) => biformat(crypto.randomBytes(length || 3), 'dec');

const randomString = (length) => crypto.randomBytes(length || 20).toString('hex');

module.exports = {
  randomInt,
  randomString,
};
