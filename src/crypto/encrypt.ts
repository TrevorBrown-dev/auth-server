import CryptoJS from 'crypto-js';
import { config } from '../env';
export const encrypt = (plaintext: string): string => {
    return CryptoJS.AES.encrypt(plaintext, config.CRYPTO_SECRET || 'NO SECRET').toString();
};
