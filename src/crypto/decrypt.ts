import CryptoJS from 'crypto-js';
import { config } from '../env';
export const decrypt = (ciphertext: string): string => {
    return CryptoJS.AES.decrypt(ciphertext, config.CRYPTO_SECRET || 'NO SECRET').toString(CryptoJS.enc.Utf8);
};
