const jwt = require ('jsonwebtoken')
const config = require('./config')
const Cryptos = require('crypto-js')
const _key = require('./server')
function verifyToken (req, res, next){
    const token = req.headers['authorization'];
    const email = req.headers['_identity']

    console.log(token)

    if (!token){

        console.log("Error")
        return res.status(401).json({
            auth: false,
            message: "No token"
        })
     
    }

    const decoded = jwt.verify(token, config.secret)

    req.userId = decoded.id;
    req.userEmail = email;
    next();
} 




module.exports = verifyToken;