const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});
const Image = mongoose.model("Image", imageSchema);
module.exports = Image;