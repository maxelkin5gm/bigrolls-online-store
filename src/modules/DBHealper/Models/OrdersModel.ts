import mongoose from "mongoose"


interface IOrder {
    client: {
        name?: string,
        tel: string,
        street?: string,
        home?: string,
        apartment?: string
    },
    info: {
        delivery?: string,
        additionalInfo?: string,
        totalPrice: number,
        date: Date
    },
    basket: any
}

const ordersSchema = new mongoose.Schema<IOrder>({
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

export type OrderModelType = (mongoose.Document<any, any, IOrder> & IOrder & {_id: mongoose.Types.ObjectId})

export default mongoose.model<IOrder>('orders', ordersSchema)