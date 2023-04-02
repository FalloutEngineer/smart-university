const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    floors:{
        type: [Number],
        required: true
    },
    pulpits:{
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Faculty', facultySchema);


