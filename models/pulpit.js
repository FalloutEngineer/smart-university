const mongoose = require('mongoose');

const pulpitSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    faculty:{
        type: String,
        required: true
    },
    rooms:{
        type: [Number],
        required: true
    },
});

module.exports = mongoose.model('Pulpit', pulpitSchema);