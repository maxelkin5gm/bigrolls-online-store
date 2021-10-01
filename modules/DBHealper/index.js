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
    static async deleteCategory(idCategory, app) {
        const category = await categoriesModel.findOne({_id: idCategory})

        try {
            if (category) {
                category.delete()
                app.deleteRouter('GET', `/${category.name}`)
                DBHelper.deleteImg(category.imgURL)
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteProduct(idProduct, app) {
        const product = await productsModel.findOne({_id: idProduct})

        try {
            if (product) {
                product.delete()
                app.deleteRouter('GET', `/${product.name}`)
                DBHelper.deleteImg(product.imgURL)
            }
        } catch (err) {
            console.log(err)
        }
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


    // connect
    static connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => {
                console.log(err)
                process.exit(1)
            });
    }

}