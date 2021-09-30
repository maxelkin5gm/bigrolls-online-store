const MExpress = require("../../modules/MExpress")
const templateEngine = require("../../modules/TemplateEngine")
const DBHelper = require("../../modules/DBHealper")


module.exports = (app) => {
    app.get('/', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Templates/categories.html', {categories: categories})
        res.end(html)
    })
    app.get('/about', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Templates/about.html', {categories})
        res.end(html)
    })
    app.get('/basket', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Templates/basket.html', {categories})
        res.end(html)
    })
    app.get('/checkout', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Templates/checkout.html', {categories})
        res.end(html)
    })
    app.get('/completed', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Templates/completed.html', {categories})
        res.end(html)
    })
    app.get('/profile', async (req, res) => {
        const result = MExpress.verifyToken(req)
        if (result) {
            const user = await DBHelper.getUserById(result.id)
            const orders = await DBHelper.getOrdersByUser(user)
            const categories = await DBHelper.getAllCategories()
            const html = await templateEngine.render('./Templates/profile.html', {categories, user, orders})
            res.end(html)
        } else res.redirect(302, '/login')
    })
    app.bindRoutersCategories(DBHelper, (category) => {
        app.get(`/${category.name}`, async (req, res) => {
            const categories = await DBHelper.getAllCategories()
            const products = await DBHelper.getProducts(category.name)
            const html = await templateEngine.render('./Templates/products.html', {categories, products})
            res.end(html)
        })
    })
}