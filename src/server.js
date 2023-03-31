require("dotenv").config();

const app = require('./app');

const PORT = process.env.PORT || 8080;
app.listen(PORT);

console.log(`Server started on port - ${PORT}`);


require('./jobs/StorageCleanup').start();
// const CryptoJS = require("crypto-js");
// const enc = CryptoJS.AES.encrypt("AI12", "secret", {iv: 0});
// console.log(enc.toString(CryptoJS.format.OpenSSL));
// const a = CryptoJS.enc.Hex.parse("e97d30ebc7eb67691f1b165275e0a382");
// const bytes = a.toString(CryptoJS.enc.Base64);
// console.log(a);
// const hex = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(enc.toString()));
// console.log(hex);
// const b = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hex));
// console.log(b);
// console.log(CryptoJS.AES.decrypt(b, "secret").toString(CryptoJS.enc.Utf8));