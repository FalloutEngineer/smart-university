const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true,
    },
    faculty:{
        type: String,
        required: true
    },
    rooms:{
        type: Array,
        required: true
    },
    building:{
        type: Array,
        required: true
    },
    temperatureSensorURL:{
        type: String,
    },
    co2SensorURL:{
        type: String
    },
    floorColor:{
        type: String,
        required: true
    },
    floorSVG:{
        type: String
    }
});

module.exports = mongoose.model('Floor', floorSchema);

