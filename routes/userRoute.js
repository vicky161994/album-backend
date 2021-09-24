const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const userRouter = express.Router();
const User = require('../models/userModel');
const generateToken = require('../config/utils');

userRouter.post("/register", expressAsyncHandler(async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    if (!name || !email || !password) {
        return res.status(401).send({
            message: 'fields are missing',
            status: 401
        })
    }
    const isUserExist = await User.findOne({
        email
    });
    if (isUserExist) {
        return res.status(200).send({
            message: "This email already registered",
            status: 200,
        });
    }
    const user = new User({
        name: name,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    const registeredUser = await user.save();
    res.status(201).send({
        message: "User Registered Successfully",
        status: "201",
    });
}))

userRouter.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
        const {
            email,
            password
        } = req.body;
        if (!email || !password) {
            return res.status(401).send({
                status: 401,
                message: "Fields are required",
            });
        }
        const isUserExist = await User.findOne({
            email
        });
        if (!isUserExist) {
            return res.status(401).send({
                status: 401,
                message: "User not found!",
            });
        }
        if (bcrypt.compareSync(password, isUserExist.password)) {
            const token = generateToken(isUserExist);
            await User.findOneAndUpdate({
                email: email
            }, {
                token: token
            });
            return res.status(200).send({
                _id: isUserExist._id,
                name: isUserExist.name,
                email: isUserExist.email,
                token: token,
            });
        } else {
            return res.status(401).send({
                message: "Invalid Credentials",
            });
        }
    })
);

module.exports = userRouter;