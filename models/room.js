const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true
    },
    floor:{
        type: Number,
        required: true
    },
    faculty:{
        type: String,
        required: true
    },
    capacity:{
        type: Number,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    photo_links:{
        type: [String],
        required: true
    },
    description:{
        type: String,
        required: false
    },
    assistant:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: false
    },
    pulpits:{
        type: [String],
        required: true
    },
    co2:{
        type: [],
        required: true
    },
    temperature:{
        type: [],
        required: true
    },
    co2_history:{
        type:[],
        required: true
    },
    temperature_history:{
        type:[],
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);