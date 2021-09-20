const mongoose = require("mongoose")
const config = require("../../config")
//models
const productsModel = require('./productsModel.js')
const categoriesModel = require('./categoriesModel.js')


module.exports = class DBHelper {
    constructor() {
        this.connect()
    }

    async getCategories() {
        const data = await categoriesModel.findOne()
        return data.categories
    }

    async getProducts(category) {
        return await productsModel.find({category: category})
    }


    connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => console.log(err));
    }
}