const mongoose = require("mongoose")
const config = require("../../config");
//models
const categoriesModel = require('./categoriesModel')

module.exports = class DBHelper {
    constructor() {
        mongoose.connect(`mongodb+srv://${config.userNameDB}:${config.userPasswordDB}@cluster0.uenld.mongodb.net/${config.nameDB}?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Mongo connected')
            })
            .catch(err => console.log(err));

    }

    async getCategories() {
        const data = await categoriesModel.findOne()
        return data.categories
    }
}