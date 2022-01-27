const mongoose = require('mongoose');

const pizza = {
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    image: String,
    category: String,
    ingredients: [String],
    sizes: [String],
}

const pizzaSchema = new mongoose.Schema(pizza);
const pizzaModel = mongoose.model('pizza', pizzaSchema);

module.exports = pizzaModel;