const mongoose = require('mongoose');

const item = {
    name: {
        type: String,
        required: true,
    },
    description: String,
    type: { required: true, type: String },
    price: Number,
    image: String,
    category: String,
    ingredients: [String],
    sizes: [String],
}

const itemSchema = new mongoose.Schema(item);
const itemModel = mongoose.model('item', itemSchema);

module.exports = itemModel;