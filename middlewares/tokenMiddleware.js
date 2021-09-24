const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
module.exports = isTokenValid = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        isTokenExists = await User.find({
            token
        });
        if (!isTokenExists.length) {
            return res.status(401).send({
                message: "Invalid Token!",
            });
        } else {
            next();
        }
    } else {
        return res.status(401).send({
            message: "Token not found!",
        });
    }
}