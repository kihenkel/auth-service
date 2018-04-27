const mongoose = require('mongoose');
const defaults = require('./defaults');

const schema = mongoose.Schema({
  accessTokenHash: { type: String, required: true },
  refreshTokenHash: { type: String, required: true },
  salt: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  renewableUntil: { type: Date, required: true },
}, Object.assign({}, defaults.options));

schema.add(defaults.schema);

const Session = mongoose.model('Session', schema);

module.exports = {
  Session,
};