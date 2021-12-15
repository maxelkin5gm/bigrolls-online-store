import MExpress from "../../modules/MExpress"
import DBHelper from "../../modules/DBHealper"
import categorySchema from "../../modules/Validate/categorySchema";
import productSchema from "../../modules/Validate/productSchema";
import orderSchema from "../../modules/Validate/orderSchema";


export default (app: MExpress) => {
    app.post('/api/create_order', async (req, res) => {
        // validate data request
        const {error, value} = orderSchema.validate(req.json)
        if (error) {
            console.log(error)
            res.statusCode = 400
            res.end()
            return
        }
        const orderData = value

        // create object products from DB
        const products = await DBHelper.getAllProducts()
        let productsObject: any = {}
        products.forEach((item) => {
            productsObject[item.id] = item
        })

        // validate totalPrice and basket info
        orderData.info.totalPrice = 0
        let flagError = false
        for (let idProduct in orderData.basket) {
            if (productsObject[idProduct]) {
                orderData.info.totalPrice += Number(productsObject[idProduct].price) * orderData.basket[idProduct].amount
                orderData.basket[idProduct].name = productsObject[idProduct].name
                orderData.basket[idProduct].price = productsObject[idProduct].price
            } else {
                flagError = true
                break
            }
        }
        if (flagError) {
            res.statusCode = 400
            res.end()
            return
        }

        // write order in DB
        const order = await DBHelper.createOrder(orderData)

        // try to write order for user
        try {
            const result = MExpress.verifyToken(req)
            if (result) {
                const user: any = await DBHelper.getUserById(result.id)
                if (user && order) {
                    user.orders.push(order.id)
                    user.save()
                }
            }
        } catch (err) {
            console.log(err)
        }
        res.end()
    })
    app.post('/api/delete_order', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            await DBHelper.deleteOrder(req.json.idOrder)
        } else {
            res.statusCode = 401
        }
        res.end()
    })
    app.post('/api/create_category', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            const {error} = categorySchema.validate(req.formData)
            if (error) {
                res.statusCode = 400
                res.end()
                return
            }
            const formData = req.formData
            const category = await DBHelper.createCategory(formData)
            app.addRouteCategory(category)
        } else {
            res.statusCode = 401
        }
        res.end()
    })
    app.post('/api/delete_category', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            await DBHelper.deleteCategory(req.json.idCategory, app)
        } else {
            res.statusCode = 401
        }
        res.end()
    })
    app.post('/api/create_product', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            const {error} = productSchema.validate(req.formData)
            if (error) {
                res.statusCode = 400
                res.end()
                return
            }
            await DBHelper.createProduct(req.formData)
        } else {
            res.statusCode = 401
        }
        res.end()
    })
    app.post('/api/delete_product', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            await DBHelper.deleteProduct(req.json.idProduct, app)
        } else {
            res.statusCode = 401
        }
        res.end()
    })
}