const mongoose = require('mongoose');
const defaults = require('./defaults');

const schema = mongoose.Schema({
  name: { type: String, index: true, required: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
}, Object.assign({}, defaults.options));

schema.add(defaults.schema);

const User = mongoose.model('User', schema);

module.exports = {
  User,
};