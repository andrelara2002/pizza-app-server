const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    document: String,
    address: {
        required: true,
        type: String
    },
    city: {
        required: true,
        type: String
    },
    zip: {
        required: true,
        type: String
    },
    phone: String,
    items: [{
        product: String,
        quantity: {
            type: Number,
            default: 1
        },
        price: Number,
        id: String
    }],
    total: Number,
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending'
    }
})

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;