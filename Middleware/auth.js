const jwt = require('jsonwebtoken');
const userModel = require("../Models/users.js");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR);

const cryptr = new Cryptr('superNova');

const auth = async (req, res, next) => {
    try {
        const decryptedToken = cryptr.decrypt(req.cookies.token);
        const decoded = jsonWebTokens.verify(decryptedToken,'abcd')
        const user = await userModel.findOne({ _id: decoded._id })

        if (!user) {
            throw new Error()
        }
        
        req.token = req.cookies.token
        req.user = user
      
        return next()
    } catch (e) {
        return res.redirect('/')
    }
}

module.exports = auth;