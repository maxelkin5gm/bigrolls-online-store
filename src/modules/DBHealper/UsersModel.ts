import mongoose from "mongoose"


const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        default: 'client'
    },

    orders: [{
        type: mongoose.Types.ObjectId,
        ref: 'orders'
    }]

})

export default mongoose.model('users', usersSchema)