import mongoose from "mongoose"


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

        date: {
            type: Date,
            default: Date.now
        }
    },

    basket: {
        type: Map,
        required: true,
        of: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            imgURL: {
                type: String,
            },
            amount: {
                type: Number,
                required: true
            },
        })
    }

})

export default mongoose.model('orders', ordersSchema)