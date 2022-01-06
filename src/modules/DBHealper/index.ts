import mongoose from 'mongoose';
import fs from 'fs';
import config from '../../config';
// eslint-disable-next-line import/no-cycle
import MExpress from '../MExpress';

// models
import ProductsModel, { ProductModelType } from './Models/ProductsModel';
import CategoriesModel, { CategoryModelType } from './Models/CategoriesModel';
import OrdersModel, { OrderModelType } from './Models/OrdersModel';
import UsersModel, { UserModelType } from './Models/UsersModel';

export default class DBHelper {
  // get
  static async getAllCategories() {
    return await CategoriesModel.find() as CategoryModelType[];
  }

  static async getAllProducts() {
    return await ProductsModel.find() as ProductModelType[];
  }

  static async getProducts(categoryName: string) {
    return await ProductsModel.find({ category: categoryName }) as ProductModelType[];
  }

  static async getOrders() {
    const orders: {
      id: string,
      client: { [k: string]: string },
      info: { [k: string]: any },
      basket: { [k: string]: any }
    }[] = [];
    const ordersData = await OrdersModel.find() as OrderModelType[];
    ordersData.forEach((item) => {
      orders.push({
        id: item.id,
        client: item.client,
        info: item.info,
        basket: Object.fromEntries(item.basket.entries()),
      });
    });
    return orders;
  }

  static async getUserByEmail(email: string) {
    return await UsersModel.findOne({ email }) as UserModelType;
  }

  static async getUserById(idUser: string) {
    return await UsersModel.findOne({ _id: idUser }) as UserModelType;
  }

  static async getOrdersByUser(user: UserModelType) {
    const orders: {
      id: string,
      client: { [k: string]: string },
      info: { [k: string]: any },
      basket: { [k: string]: any }
    }[] = [];
    const newOrdersId: mongoose.Types.ObjectId[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const orderId of user.orders as []) {
      // eslint-disable-next-line no-await-in-loop
      const order = await OrdersModel.findOne({ _id: orderId }) as OrderModelType;
      if (order) {
        const orderNew = {
          id: order.id,
          client: order.client,
          info: order.info,
          basket: Object.fromEntries(order.basket.entries()),
        };
        orders.push(orderNew);
        newOrdersId.push(orderId);
      }
    }
    // eslint-disable-next-line no-param-reassign
    user.orders = newOrdersId;
    await user.save();

    return orders;
  }

  // create
  static async createOrder(dataOrder: any) {
    return new OrdersModel(dataOrder).save();
  }

  static async createCategory(dataCategory: any) {
    return await new CategoriesModel(dataCategory).save() as CategoryModelType;
  }

  static async createProduct(dataProduct: any) {
    return await new ProductsModel(dataProduct).save() as ProductModelType;
  }

  static async createUser(dataUser: any) {
    return await new UsersModel(dataUser).save() as UserModelType;
  }

  // delete
  static async deleteCategory(idCategory: string, app: MExpress) {
    const category = await CategoriesModel.findOne({ _id: idCategory });

    try {
      if (category) {
        category.delete();
        app.deleteRouter('GET', `/${category.name}`);
        DBHelper.deleteImg(category.imgURL as string);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteProduct(idProduct: string, app: MExpress) {
    const product = await ProductsModel.findOne({ _id: idProduct });
    try {
      if (product) {
        product.delete();
        app.deleteRouter('GET', `/${product.name}`);
        DBHelper.deleteImg(product.imgURL as string);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteOrder(idOrder: string) {
    await OrdersModel.findOneAndDelete({ _id: idOrder });
  }

  static deleteImg(imgURL: string) {
    const pathImg = imgURL.split('/');
    const nameImg = pathImg[pathImg.length - 1];
    if (nameImg === 'placeholder.webp') {
      return;
    }
    fs.unlinkSync(`.${imgURL}`);
  }

  // connect
  static connect() {
    mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
      .then(() => {
        console.log('Mongo connected');
      })
      .catch((err) => {
        console.log(err);
        DBHelper.connect();
      });
  }
}
