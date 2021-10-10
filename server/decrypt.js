const jwt = require ('jsonwebtoken')
const config = require('./config')
const CryptoJS = require('crypto-js');
const { json } = require('body-parser');
async function decrypted (req, res, next){
    const token = req.headers['authorization'];
    const email = req.headers['_identity']

    
    if (!token){

        console.log("Error")
        return res.status(401).json({
            auth: false,
            message: "No token"
        })
     
    }


    let dec = await desc (email);

    req.userId = token;
    req.userEmail = dec;
    next();
} 


function desc(email){
    let _key = 'GKDESC3412'
    let _iv = 'GKDESC3412'

    let decr = CryptoJS.AES.decrypt(
      email, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);

    
    return decr.replace(/['"]+/g, '');
    
}


module.exports = decrypted;