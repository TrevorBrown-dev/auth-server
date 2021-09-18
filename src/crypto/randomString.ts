import Crypto from 'crypto';

export const randomString = (size = 64) => {
    const str = Crypto.randomBytes(size).toString('hex');
    console.log(str);
    return str;
};
