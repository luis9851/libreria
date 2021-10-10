const jwt = require ('jsonwebtoken')
const config = require('./config')
const CryptoJS = require('crypto-js')
async function encrypted (req, res, next){
    
    const email = req.body.email
    if (!email){

        console.log("Error")
        return res.status(401).json({
            auth: false,
            message: "No token"
        })
     
    }


     let enc =  await encrypt(email)


    req.userEmail = enc;

     next();

    
} 


function encrypt(email){
    let _key = 'GKDESC3412'
    let _iv = 'GKDESC3412'
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(email), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    encrypted = encrypted.toString();

    return encrypted
    
}


module.exports = encrypted;