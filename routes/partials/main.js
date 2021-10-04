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
            let sort = 0;
            switch (req.url_parts.searchParams.get('sort')) {
                case '1':
                    sort = 1
                    products.sort(function (a, b) {
                        if (Number(a.price) < Number(b.price)) {
                            return 1;
                        }
                        if (Number(a.price) > Number(b.price)) {
                            return -1;
                        }
                        return 0;
                    });
                    break
                case '2':
                    sort = 2
                    products.sort(function (a, b) {
                        if (Number(a.price) > Number(b.price)) {
                            return 1;
                        }
                        if (Number(a.price) < Number(b.price)) {
                            return -1;
                        }
                        return 0;
                    });
                    break
            }
            const html = await templateEngine.render('./Templates/products.html', {categories, products, sort})
            res.end(html)
        })
    })
}