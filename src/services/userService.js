const { User } = require('./../models/User');
const { generateRandomKey, generateHash } = require('./helpers/encrypt');

const createUser = async (username, password) => {
  const salt = await generateRandomKey();
  const passwordHash = await generateHash(password, salt);
  return new User({ name: username, passwordHash, salt }).save();
};

const deleteUser = (username) =>
  User.deleteOne({ name: username }).exec();

const changePassword = async (username, newPassword) => {
  const user = await User.findOne({ name: username }).exec();

  if (!user) {
    return undefined;
  }

  const salt = await generateRandomKey();
  const passwordHash = await generateHash(newPassword, salt);
  user.passwordHash = passwordHash;
  user.salt = salt;
  return user.save();
};

const authenticate = async (username, password) => {
  const user = await User.findOne({ name: username }).exec();

  if (!user) {
    return false;
  }

  const passwordHash = await generateHash(password, user.salt);
  return user.passwordHash === passwordHash;
};

module.exports = {
  createUser,
  deleteUser,
  changePassword,
  authenticate,
};