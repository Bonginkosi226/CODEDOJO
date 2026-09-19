// A JWT is stateless, so to "log out everywhere" after a password reset we
// record passwordChangedAt on the user and reject any token issued before it.
// `decoded.iat` is in whole seconds, so compare at second precision — a token
// issued right after the reset (a fresh login) must still be accepted.
export const isSessionInvalidated = (user, decoded) => {
  if (!user || !user.passwordChangedAt || !decoded || !decoded.iat) {
    return false;
  }
  return decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000);
};
