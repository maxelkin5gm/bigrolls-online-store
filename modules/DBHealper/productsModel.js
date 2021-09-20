const mongoose = require("mongoose");


const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    price: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    imgURL: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('products', productsSchema)
