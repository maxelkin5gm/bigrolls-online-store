const mongoose = require("mongoose");


const ordersSchema = new mongoose.Schema({
    client: {
        name: {
            type: String
        },
        tel: {
            type: String,
            required: true
        },
        street: {
            type: String
        },
        home: {
            type: String
        },
        apartment: {
            type: String
        }
    },

    info: {
        delivery: {
            type: String
        },

        additionalInfo: {
            type: String
        },

        totalPrice: {
            type: Number,
            required: true
        },
    },


    basket: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('orders', ordersSchema)