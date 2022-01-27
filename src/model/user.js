const mongoose = require('mongoose');

const user = {
    name: {
        type: String,
        required: true,
    },
    email: String,
    password: String,
    document: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    accessLevel: {
        type: Number,
        default: 0
    }
}

const userSchema = new mongoose.Schema(user);
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;