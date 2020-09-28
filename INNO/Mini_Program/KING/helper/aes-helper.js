import Conf from "../conf";
import CryptoJS from "../libs/sign/aes/aes";
import "../libs/sign/aes/mode-ecb";

const key = CryptoJS.enc.Utf8.parse(Conf.AES_KEY);
const iv = CryptoJS.enc.Utf8.parse(Conf.AES_IV);
const cfg = {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
}

//加密
function encrypt(word) {

    if (typeof (word) == 'object') {
        word = JSON.stringify(word);
    }
    let encrypted = CryptoJS.AES.encrypt(word, key, cfg);

    return encrypted.ciphertext.toString();
}

//解密
function decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);

    let decrypt = CryptoJS.AES.decrypt(srcs, key, cfg);

    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    
    return decryptedStr.toString();
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}