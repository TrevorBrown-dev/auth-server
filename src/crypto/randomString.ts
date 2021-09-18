import Crypto from 'crypto';

export const randomString = (size = 21) => {
    const string = Crypto.randomBytes(size).toString('base64').slice(0, size);
    return encodeURI(string);
};
