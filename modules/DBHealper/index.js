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

    // get
    getCategories() {
        return categoriesModel.find()
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


    // create
    createOrder(dataOrder) {
        new ordersModel(dataOrder).save()
    }

    async createCategory(dataCategory) {
        await new categoriesModel(dataCategory).save()
    }

    async createProduct(dataProduct) {
        await new productsModel(dataProduct).save()
    }


    // delete
    async deleteCategory(idCategory) {
        await categoriesModel.findOneAndDelete({_id: idCategory})
    }

    async deleteProduct(idProduct) {
        await productsModel.findOneAndDelete({_id: idProduct})
    }

    async deleteOrder(idOrder) {
        console.log(idOrder)
        await ordersModel.findOneAndDelete({_id: idOrder})
    }


    connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => console.log(err));
    }
}