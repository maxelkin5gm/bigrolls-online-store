import mongoose from "mongoose"


const categoriesSchema = new mongoose.Schema({
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

export default mongoose.model('categories', categoriesSchema)


