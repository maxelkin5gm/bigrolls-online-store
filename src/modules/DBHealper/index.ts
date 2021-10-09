import mongoose from "mongoose"
import config from "../../config"
import fs from "fs"
import MExpress from "../MExpress";

//models
import ProductsModel from './ProductsModel'
import CategoriesModel from './CategoriesModel'
import OrdersModel from './OrdersModel'
import UsersModel from './UsersModel'


export default class DBHelper {

    // get
    static getAllCategories() {
        return CategoriesModel.find()
    }

    static getAllProducts() {
        return ProductsModel.find()
    }

    static getProducts(categoryName: string) {
        return ProductsModel.find({category: categoryName})
    }

    static async getOrders() {
        let orders: {
            id: string,
            client: { [k: string]: string },
            info: { [k: string]: any },
            basket: { [k: string]: any }
        }[] = []
        let ordersData = await OrdersModel.find()
        ordersData.forEach(function (item: any) {
            orders.push({
                id: item.id,
                client: item.client,
                info: item.info,
                basket: Object.fromEntries(item.basket.entries())
            })
        })
        return orders
    }

    static getUserByEmail(email: string) {
        return UsersModel.findOne({email: email})
    }

    static getUserById(idUser: string) {
        return UsersModel.findOne({_id: idUser})
    }

    static async getOrdersByUser(user: any) {
        let orders = []
        let newOrdersId = []
        for (let orderId of user.orders) {
            const order: any = await OrdersModel.findOne({_id: orderId})
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
    static async createOrder(dataOrder: any) {
        return await new OrdersModel(dataOrder).save()
    }

    static async createCategory(dataCategory: any) {
        await new CategoriesModel(dataCategory).save()
    }

    static async createProduct(dataProduct: any) {
        await new ProductsModel(dataProduct).save()
    }

    static async createUser(dataUser: any) {
        await new UsersModel(dataUser).save()
    }


    // delete
    static async deleteCategory(idCategory: string, app: MExpress) {
        const category = await CategoriesModel.findOne({_id: idCategory})

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

    static async deleteProduct(idProduct: string, app: MExpress) {
        const product = await ProductsModel.findOne({_id: idProduct})

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

    static async deleteOrder(idOrder: string) {
        await OrdersModel.findOneAndDelete({_id: idOrder})
    }

    static deleteImg(imgURL: string) {
        const pathImg = imgURL.split('/')
        const nameImg = pathImg[pathImg.length - 1]
        if (nameImg === 'placeholder.webp') {
            return
        }
        fs.unlinkSync(imgURL)
    }


    // connect
    static connect() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => {
                console.log(err)
                DBHelper.connect()
            })
    }

}