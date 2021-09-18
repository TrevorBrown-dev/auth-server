import CryptoJS from 'crypto-js';
import { config } from '../env';
import jwt from 'jwt-simple';
export const encrypt = (plaintext: string): string => {
    return CryptoJS.AES.encrypt(plaintext, config.CRYPTO_SECRET || 'NO SECRET').toString();
};
export const encryptJwt = (user: any) => {
    const timestamp = Date.now();
    return jwt.encode(
        {
            sub: user.id,
            iat: timestamp,
        },
        config.JWT_SECRET as string
    );
};
