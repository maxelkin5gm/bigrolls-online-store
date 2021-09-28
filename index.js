const jwt = require("jsonwebtoken")

const config = require("./config")
const MExpress = require("./modules/MExpress")
const TemplateEngine = require("./modules/TemplateEngine")
const DBHelper = require("./modules/DBHealper")
const CookieHelper = require("./modules/CookieHelper")


const db = new DBHelper()
const app = new MExpress(db)
const templateEngine = new TemplateEngine()

// middleware
app.use(MExpress.getJSON)
app.use(MExpress.getFormData)
app.use(CookieHelper.getCookie)


app.get('/', async (req, res) => {
    const categories = await db.getAllCategories()
    const html = await templateEngine.render('./Templates/categories.html', {categories: categories})
    res.end(html)
})
app.get('/about', async (req, res) => {
    const categories = await db.getAllCategories()
    const html = await templateEngine.render('./Templates/about.html', {categories})
    res.end(html)
})
app.get('/basket', async (req, res) => {
    const categories = await db.getAllCategories()
    const html = await templateEngine.render('./Templates/basket.html', {categories})
    res.end(html)
})
app.get('/checkout', async (req, res) => {
    const categories = await db.getAllCategories()
    const html = await templateEngine.render('./Templates/checkout.html', {categories})
    res.end(html)
})
app.get('/completed', async (req, res) => {
    const categories = await db.getAllCategories()
    const html = await templateEngine.render('./Templates/completed.html', {categories})
    res.end(html)
})
app.get('/profile', async (req, res) => {
    const result = MExpress.verifyToken(req)
    if (result) {
        const user = await db.getUserById(result.id)
        const orders = await db.getOrdersByUser(user)
        const categories = await db.getAllCategories()
        const html = await templateEngine.render('./Templates/profile.html', {categories, user, orders})
        res.end(html)
    } else res.redirect(302, '/login')
})
app.bindRoutersCategories(db, (category) => {
    app.get(`/${category.name}`, async (req, res) => {
        const categories = await db.getAllCategories()
        const products = await db.getProducts(category.name)
        const html = await templateEngine.render('./Templates/products.html', {categories, products})
        res.end(html)
    })
})


// admin
app.get('/admin', async (req, res) => {
    const result = MExpress.verifyToken(req)
    if (result.role === 'admin') {
        const orders = await db.getOrders()
        const html = await templateEngine.render('./Templates/admin/admin-orders.html', {orders})
        res.end(html)
    } else res.redirect(302, '/login')

})
app.get('/admin/products', async (req, res) => {
    const categories = await db.getAllCategories()
    const products = await db.getAllProducts()
    const html = await templateEngine.render('./Templates/admin/admin-products.html', {categories, products})
    res.end(html)
})
app.get('/admin/categories', async (req, res) => {
    const categories = await db.getAllCategories()
    const html = await templateEngine.render('./Templates/admin/admin-categories.html', {categories})
    res.end(html)
})


// api
app.post('/api/create_order', async (req, res) => {
    const order = await db.createOrder(req.json)
    const result = MExpress.verifyToken(req)
    if (result) {
        const user = await db.getUserById(result.id)
        if (user) {
            user.orders.push(order.id)
            user.save()
        }
    }
    res.end()
})
app.post('/api/delete_order', async (req, res) => {
    await db.deleteOrder(req.json.idOrder)
    res.end()
})
app.post('/api/create_category', async (req, res) => {
    const formData = req.formData
    await db.createCategory(formData)
    app.get(`/${formData.name}`, async (req, res) => {
        const categories = await db.getAllCategories()
        const products = await db.getProducts(formData.name)
        const html = await templateEngine.render('./Templates/products.html', {categories, products})
        res.end(html)
    })
    res.end()
})
app.post('/api/delete_category', async (req, res) => {
    await db.deleteCategory(req.json.idCategory)
    app.deleteRouter('GET', `/${req.json.nameCategory}`)
    db.deleteImg(req.json.imgURL)
    res.end()
})
app.post('/api/create_product', async (req, res) => {
    await db.createProduct(req.formData)
    res.end()
})
app.post('/api/delete_product', async (req, res) => {
    await db.deleteProduct(req.json.idProduct)
    res.end()
})


// authenticate
app.get('/login', async (req, res) => {
    const result = MExpress.verifyToken(req)
    if (result) {
        switch (result.role) {
            case 'admin':
                res.redirect(302, '/admin')
                break
            case 'client':
                res.redirect(302, '/')
                break
            default:
                res.redirect(302, '/')
        }
    } else {
        const html = await templateEngine.render('./Templates/login.html', {})
        res.end(html)
    }
})
app.post('/login', async (req, res) => {
    const user = await db.getUserByEmail(req.json.email)
    if (user) {
        if (user.password === req.json.password) {
            const tokenData = {
                id: user.id,
                role: user.role,
                host: req.socket.remoteAddress
            }
            let token = jwt.sign(tokenData, config.JWT_secret_key)
            CookieHelper.setCookie('token', token)
            CookieHelper.sendCookie(res)
            res.end()
            return
        }
    }
    res.statusCode = 401
    res.end()
})
app.post('/logout', async (req, res) => {
    CookieHelper.deleteCookie('token')
    CookieHelper.sendCookie(res)
    res.end()
})

app.get('/registration', async (req, res) => {
    const html = await templateEngine.render('./Templates/registration.html', {})
    res.end(html)
})
app.post('/registration', async (req, res) => {
    req.json.role = 'client'
    await db.createUser(req.json)
    res.end()
})


app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}/`)
})


