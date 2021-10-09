import mongoose from "mongoose"


interface IProducts {
    name: string,
    price: string,
    category: string,
    imgURL?: string
}

const productsSchema = new mongoose.Schema<IProducts>({
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

export type ProductModelType = (mongoose.Document<any, any, IProducts> & IProducts & { _id: mongoose.Types.ObjectId })

export default mongoose.model<IProducts>('products', productsSchema)
