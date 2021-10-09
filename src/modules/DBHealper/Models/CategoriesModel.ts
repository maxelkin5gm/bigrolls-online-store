import mongoose from "mongoose"


interface ICategory {
    name: string,
    imgURL?: string
}

const categoriesSchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true
    },

    imgURL: {
        type: String,
        default: ''
    }
})

export type CategoryModelType = (mongoose.Document<any, any, ICategory> & ICategory & { _id: mongoose.Types.ObjectId })

export default mongoose.model<ICategory>('categories', categoriesSchema)


