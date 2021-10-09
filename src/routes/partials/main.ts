import MExpress from "../../modules/MExpress"
import templateEngine from "../../modules/TemplateEngine"
import DBHelper from "../../modules/DBHealper"


export default (app: MExpress) => {
    app.get('/', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Views/categories.html', {categories: categories})
        res.end(html)
    })
    app.get('/about', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Views/about.html', {categories})
        res.end(html)
    })
    app.get('/basket', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Views/basket.html', {categories})
        res.end(html)
    })
    app.get('/checkout', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Views/checkout.html', {categories})
        res.end(html)
    })
    app.get('/completed', async (req, res) => {
        const categories = await DBHelper.getAllCategories()
        const html = await templateEngine.render('./Views/completed.html', {categories})
        res.end(html)
    })
    app.get('/profile', async (req, res) => {
        const result = MExpress.verifyToken(req)
        if (result) {
            const user = await DBHelper.getUserById(result.id)
            const orders = await DBHelper.getOrdersByUser(user)
            const categories = await DBHelper.getAllCategories()
            const html = await templateEngine.render('./Views/profile.html', {categories, user, orders})
            res.end(html)
        } else res.redirect(302, '/login')
    })
}