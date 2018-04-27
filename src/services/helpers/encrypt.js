const crypto = require('crypto');

const generateRandomBuffer = () =>
  new Promise((resolve, reject) => 
    crypto.randomBytes(32, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
  }));

const generateRandomKey = () =>
  generateRandomBuffer().then(buffer => buffer.toString('hex'));

const generateHash = (password, salt) =>
  new Promise((resolve, reject) => 
    crypto.pbkdf2(password, salt, 10, 64, 'sha512', (err, hash) => {
      if (err) return reject(err);
      resolve(hash.toString('hex'));
  }));

module.exports = {
  generateRandomKey,
  generateHash,
};