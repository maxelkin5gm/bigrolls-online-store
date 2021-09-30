const MExpress = require("../../modules/MExpress")
const templateEngine = require("../../modules/TemplateEngine")
const DBHelper = require("../../modules/DBHealper")


module.exports = (app) => {
    app.post('/api/create_order', async (req, res) => {
        const order = await DBHelper.createOrder(req.json)
        const result = MExpress.verifyToken(req)
        if (result) {
            const user = await DBHelper.getUserById(result.id)
            if (user) {
                user.orders.push(order.id)
                user.save()
            }
        }
        res.end()
    })
    app.post('/api/delete_order', async (req, res) => {
        await DBHelper.deleteOrder(req.json.idOrder)
        res.end()
    })
    app.post('/api/create_category', async (req, res) => {
        const formData = req.formData
        await DBHelper.createCategory(formData)
        app.get(`/${formData.name}`, async (req, res) => {
            const categories = await DBHelper.getAllCategories()
            const products = await DBHelper.getProducts(formData.name)
            const html = await templateEngine.render('./Templates/products.html', {categories, products})
            res.end(html)
        })
        res.end()
    })
    app.post('/api/delete_category', async (req, res) => {
        await DBHelper.deleteCategory(req.json.idCategory)
        app.deleteRouter('GET', `/${req.json.nameCategory}`)
        DBHelper.deleteImg(req.json.imgURL)
        res.end()
    })
    app.post('/api/create_product', async (req, res) => {
        await DBHelper.createProduct(req.formData)
        res.end()
    })
    app.post('/api/delete_product', async (req, res) => {
        await DBHelper.deleteProduct(req.json.idProduct)
        res.end()
    })
}