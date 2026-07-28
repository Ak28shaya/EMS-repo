const CryptoJS = require("crypto-js");

const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(
        password,
        process.env.AES_SECRET_KEY
    ).toString();
};

const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(
        encryptedPassword,
        process.env.AES_SECRET_KEY
    );

    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
    encryptPassword,
    decryptPassword
};