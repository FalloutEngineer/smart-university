const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true
    },
    faculty:{
        type: String,
        required: true
    },
    rooms:{
        type: Array,
        required: true
    },
});

module.exports = mongoose.model('Floor', floorSchema);

