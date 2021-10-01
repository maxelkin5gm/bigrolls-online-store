const MExpress = require("../../modules/MExpress")
const templateEngine = require("../../modules/TemplateEngine")
const DBHelper = require("../../modules/DBHealper")


module.exports = (app) => {
    app.get('/admin', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            const orders = await DBHelper.getOrders()
            const html = await templateEngine.render('./Templates/admin/admin-orders.html', {orders})
            res.end(html)
        } else res.redirect(302, '/login')
    })
    app.get('/admin/products', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            const categories = await DBHelper.getAllCategories()
            const products = await DBHelper.getAllProducts()
            const html = await templateEngine.render('./Templates/admin/admin-products.html', {categories, products})
            res.end(html)
        } else res.redirect(302, '/login')
    })
    app.get('/admin/categories', async (req, res) => {
        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            const categories = await DBHelper.getAllCategories()
            const html = await templateEngine.render('./Templates/admin/admin-categories.html', {categories})
            res.end(html)
        } else res.redirect(302, '/login')
    })
}