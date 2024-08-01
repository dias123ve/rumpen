const mongoose = require('mongoose');

const modelProgram = new mongoose.Schema({
    nama:{
        type: String,
        required: true
    },
    contents:[{
        _id: false,
        nama_lengkap: {
            type: String,
        },
        link:{
            type: String
        }
    }]
});

const Program = mongoose.model("Program", modelProgram);
module.exports = Program