const mongoose = require("mongoose")
const config = require("../../config")
//models
const productsModel = require('./productsModel')
const categoriesModel = require('./categoriesModel')
const ordersModel = require('./ordersModel')


module.exports = class DBHelper {
    constructor() {
        this.connect()
    }

    async getCategories() {
        const data = await categoriesModel.findOne()
        return data.categories
    }

    getAllProducts() {
        return productsModel.find()
    }

    getProducts(category) {
        return productsModel.find({category: category})
    }

    getOrders() {
        return ordersModel.find()
    }

    createOrder(dataOrder) {
        new ordersModel(dataOrder).save()
    }


    connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => console.log(err));
    }
}