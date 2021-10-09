import mongoose from "mongoose"


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

export default mongoose.model('products', productsSchema)
