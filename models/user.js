const mongoose = require('mongoose');

const User = new mongoose.Schema({
    login: {type: String, unique: true, required: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model('User', User);