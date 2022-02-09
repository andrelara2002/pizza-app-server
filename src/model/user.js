const mongoose = require('mongoose');

const user = {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    document: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    neighborhood: String,
    zip: String,
    paymentMethods: [
        {
            cardNumber: { required: true, type: String },
            month: { required: true, type: Number },
            year: { required: true, type: Number },
            Document: { required: true, type: String }
        }
    ],
    accessLevel: { type: Number, default: 0 },
    adminToken: String,
    chatToken: String
}

const userSchema = new mongoose.Schema(user);
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;