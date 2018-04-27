const moment = require('moment');
const { Session } = require('./../models/Session');
const { generateRandomKey, generateHash } = require('./helpers/encrypt');

const createSession = async () => {
  const [accessToken, refreshToken, salt] = await Promise.all([
    generateRandomKey(),
    generateRandomKey(),
    generateRandomKey(),
  ]);
  const [accessTokenHash, refreshTokenHash] = await Promise.all([
    generateHash(accessToken, salt),
    generateHash(refreshToken, salt),
  ]);
  const expiresAt = moment().add(1, 'day').toDate();
  const renewableUntil = moment().add(365, 'days').toDate();
  const session = await new Session({ accessTokenHash, refreshTokenHash, salt, expiresAt, renewableUntil }).save();
  return { sessionId: session._id, accessToken, refreshToken };
};

const tryRefreshSession = async (session, refreshToken) => {
  if (moment(session.renewableUntil).isBefore()) { // Refresh expired
    return undefined;
  }

  const refreshTokenHash = await generateHash(refreshToken, session.salt);
  if (session.refreshTokenHash !== refreshTokenHash) {
    return undefined;
  }

  const [newAccessToken, newRefreshToken] = await Promise.all([
    generateRandomKey(),
    generateRandomKey(),
  ]);
  const [newAccessTokenHash, newRefreshTokenHash] = await Promise.all([
    generateHash(newAccessToken, session.salt),
    generateHash(newRefreshToken, session.salt),
  ]);

  const expiresAt = moment().add(1, 'day').toDate();
  const renewableUntil = moment().add(365, 'days').toDate();

  session.accessTokenHash = newAccessTokenHash;
  session.refreshTokenHash = newRefreshTokenHash;
  session.expiresAt = expiresAt;
  session.renewableUntil = renewableUntil;
  await session.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const authenticate = async (sessionId, accessToken, refreshToken) => {
  if (!sessionId || !accessToken) {
    return undefined;
  }

  const session = await Session.findById(sessionId).exec();
  if (!session) {
    return undefined; // Session not found
  }

  const accessTokenHash = await generateHash(accessToken, session.salt);
  if (session.accessTokenHash !== accessTokenHash) {
    return undefined; // Access token wrong
  }
  
  if (moment(session.expiresAt).isSameOrAfter()) {
    return { accessToken, refreshToken }; // SUCCESS
  }
  const refreshResult = await tryRefreshSession(session, refreshToken);
  if (!refreshResult) {
    return undefined; // Refresh expired
  }

  return { accessToken: refreshResult.accessToken, refreshToken: refreshResult.refreshToken }; // SUCCESS (refresh)
};

module.exports = {
  createSession,
  authenticate,
};