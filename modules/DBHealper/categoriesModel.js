const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
    {
        'categories': [
            {
                name: {
                    type: String,
                    required: true,
                    unique: true
                },

                imgURL: {
                    type: String,
                    default: ''
                }
            }
        ]
    })

module.exports = mongoose.model('categories', categoriesSchema)


