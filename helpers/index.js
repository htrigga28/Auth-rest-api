import crypto from 'crypto';

export const randomString = (length = 128) => {
  crypto.randomBytes(length).toString('hex');
};

export const generateToken = (salt, password) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');
};
