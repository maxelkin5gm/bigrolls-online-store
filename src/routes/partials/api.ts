import MExpress from "../../modules/MExpress"
import DBHelper from "../../modules/DBHealper"


export default (app: MExpress) => {
    app.post('/api/create_order', async (req, res) => {
        const order = await DBHelper.createOrder(req.json)
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
            const formData = req.formData
            const category = await DBHelper.createCategory(formData)
            app.routeCategory(category)
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