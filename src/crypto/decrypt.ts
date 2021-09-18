import CryptoJS from 'crypto-js';
import { config } from '../env';
import jwt from 'jwt-simple';
export const decrypt = (ciphertext: string): string => {
    return CryptoJS.AES.decrypt(ciphertext, config.CRYPTO_SECRET || 'NO SECRET').toString(CryptoJS.enc.Utf8);
};

export const decryptJwt = (token: string): { sub: string; iat: string } => {
    return jwt.decode(token, config.JWT_SECRET || 'NO SECRET');
};
