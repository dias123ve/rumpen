const mongoose = require('mongoose');

const modelUser = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", modelUser);

module.exports = User