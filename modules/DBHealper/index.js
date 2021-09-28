const mongoose = require("mongoose")
const config = require("../../config")
const fs = require('fs')
//models
const productsModel = require('./productsModel')
const categoriesModel = require('./categoriesModel')
const ordersModel = require('./ordersModel')
const usersModel = require('./usersModel')


module.exports = class DBHelper {
    constructor() {
        this.connect()
    }

    // get
    getAllCategories() {
        return categoriesModel.find()
    }

    getAllProducts() {
        return productsModel.find()
    }

    getProducts(category) {
        return productsModel.find({category: category})
    }

    async getOrders() {
        let orders = []
        let ordersData = await ordersModel.find()
        ordersData.forEach(function (item) {
            orders.push({
                id: item.id,
                client: item.client,
                info: item.info,
                basket: Object.fromEntries(item.basket.entries())
            })
        })

        return orders
    }

    getUserByEmail(email) {
        return usersModel.findOne({email: email})
    }

    getUserById(idUser) {
        return usersModel.findOne({_id: idUser})
    }

    async getOrdersByUser(user) {
        let orders = []
        let newOrdersId = []
        for (let orderId of user.orders) {
            const order = await ordersModel.findOne({_id: orderId})
            if (order) {
                let orderNew = {
                    id: order.id,
                    client: order.client,
                    info: order.info,
                    basket: Object.fromEntries(order.basket.entries())
                }
                orders.push(orderNew)
                newOrdersId.push(orderId)
            }
        }
        user.orders = newOrdersId
        await user.save()

        return orders
    }


    // create
    async createOrder(dataOrder) {
        return await new ordersModel(dataOrder).save()
    }

    async createCategory(dataCategory) {
        await new categoriesModel(dataCategory).save()
    }

    async createProduct(dataProduct) {
        await new productsModel(dataProduct).save()
    }

    async createUser(dataUser) {
        await new usersModel(dataUser).save()
    }


    // delete
    async deleteCategory(idCategory) {
        await categoriesModel.findOneAndDelete({_id: idCategory})
    }

    async deleteProduct(idProduct) {
        await productsModel.findOneAndDelete({_id: idProduct})
    }

    async deleteOrder(idOrder) {
        await ordersModel.findOneAndDelete({_id: idOrder})
    }

    deleteImg(imgURL) {
        let nameImg = imgURL.split('/')
        nameImg = nameImg[nameImg.length - 1]
        if (nameImg === 'placeholder.webp') {
            return
        }
        fs.unlinkSync(nameImg)
    }


    connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => console.log(err));
    }
}