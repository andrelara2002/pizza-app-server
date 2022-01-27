const mongoose = require('mongoose');
const esfirra = {
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    image: String,
    category: String,
    ingredients: [String],
}
const esfirraSchema = new mongoose.Schema(esfirra);
const esfirraModel = mongoose.model('esfirra', esfirraSchema);

module.exports = esfirraModel;