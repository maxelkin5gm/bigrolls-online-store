const mongoose = require("mongoose")
const config = require("../../config")
const fs = require('fs')
//models
const productsModel = require('./productsModel')
const categoriesModel = require('./categoriesModel')
const ordersModel = require('./ordersModel')
const usersModel = require('./usersModel')


module.exports = class DBHelper {

    // get
    static getAllCategories() {
        return categoriesModel.find()
    }

    static getAllProducts() {
        return productsModel.find()
    }

    static getProducts(category) {
        return productsModel.find({category: category})
    }

    static async getOrders() {
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

    static getUserByEmail(email) {
        return usersModel.findOne({email: email})
    }

    static getUserById(idUser) {
        return usersModel.findOne({_id: idUser})
    }

    static async getOrdersByUser(user) {
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
    static async createOrder(dataOrder) {
        return await new ordersModel(dataOrder).save()
    }

    static async createCategory(dataCategory) {
        await new categoriesModel(dataCategory).save()
    }

    static async createProduct(dataProduct) {
        await new productsModel(dataProduct).save()
    }

    static async createUser(dataUser) {
        await new usersModel(dataUser).save()
    }


    // delete
    static async deleteCategory(idCategory) {
        await categoriesModel.findOneAndDelete({_id: idCategory})
    }

    static async deleteProduct(idProduct) {
        await productsModel.findOneAndDelete({_id: idProduct})
    }

    static async deleteOrder(idOrder) {
        await ordersModel.findOneAndDelete({_id: idOrder})
    }

    static deleteImg(imgURL) {
        let nameImg = imgURL.split('/')
        nameImg = nameImg[nameImg.length - 1]
        if (nameImg === 'placeholder.webp') {
            return
        }
        fs.unlinkSync(nameImg)
    }


    static connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => console.log(err));
    }

}