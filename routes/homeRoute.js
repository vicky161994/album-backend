const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const homeRouter = express.Router();
const Image = require('../models/imageModel');
const isAuth = require('../middlewares/authMiddleware');
const isTokenValid = require('../middlewares/tokenMiddleware');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime');

const imageStorage = multer.diskStorage({
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() +
            path.extname(file.originalname))
    }
});
const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000 * 10 // 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // upload only png, jpg & jpeg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

homeRouter.post('/upload-image', isTokenValid, isAuth, imageUpload.single('image'), expressAsyncHandler(async (req, res) => {
    const host = req.hostname;
    // const port = process.env.PORT || 4000
    const imageData = new Image({
        imageName: `${host}/${req.file.filename}`,
        userID: mongoose.Types.ObjectId(req.user._id)
    })
    await imageData.save();
    res.status(201).json({
        message: "image uploaded successfully",
        status: 201
    });
}))

homeRouter.post('/upload-base64-image', isTokenValid, isAuth, expressAsyncHandler(async (req, res) => {
    const host = req.hostname;
    // const port = process.env.PORT || 4000
    var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    let fileName = `image_${Date.now()}.${extension}`;
    fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
    const imageData = new Image({
        imageName: `${host}/${fileName}`,
        userID: mongoose.Types.ObjectId(req.user._id)
    })
    await imageData.save();
    res.status(201).json({
        message: "image uploaded successfully",
        status: 201
    });
}))

homeRouter.post('/get-all-image', isTokenValid, isAuth, expressAsyncHandler(async (req, res) => {
    const host = req.hostname
    const {
        pageNumber,
        limit
    } = req.body;
    const skip = (pageNumber - 1) * limit;
    let query = Image.find().sort('-createdAt').skip(skip).limit(parseInt(limit))
    const imageList = await query.exec();
    res.status(200).json({
        message: 'all image fetched',
        status: 200,
        imageList
    })
}))

module.exports = homeRouter;