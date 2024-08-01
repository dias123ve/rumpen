const mongoose = require('mongoose');

const muridTo = new mongoose.Schema({
    _id: false,
    nama:{
        type: String,
        required: true
    },
    skor:{
        type: Number,
        required: true
    },
    ranking:{
        type: Number,
        required: true
    }
});

const modelTo = new mongoose.Schema({
    nama_to:{
        type: String,
        required: true
    },
    murids:{
        type: [muridTo],
        required: true
    }
})

const Program = mongoose.model("TO", modelTo);
module.exports = Program