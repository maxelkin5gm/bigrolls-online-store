const MExpress = require('./modules/MExpress')
const config = require("./config")
const TemplateEngine = require("./modules/TemplateEngine")
const DBHelper = require("./modules/DBHealper")

const app = new MExpress()
const templateEngine = new TemplateEngine()
const db = new DBHelper()


app.get('/', async (req, res) => {
    const categories = await db.getCategories()
    const html = await templateEngine.render('./Templates/categories.html', {categories: categories})
    res.end(html)
})

app.get('/Роллы', async (req, res) => {
    const categories = await db.getCategories()
    const products = await db.getProducts('Роллы')
    const html = await templateEngine.render('./Templates/products.html', {categories, products})
    res.end(html)
})

app.get('/Сеты', async (req, res) => {
    const categories = await db.getCategories()
    const products = await db.getProducts('Сеты')
    const html = await templateEngine.render('./Templates/products.html', {categories, products})
    res.end(html)
})

app.get('/about', async (req, res) => {
    const categories = await db.getCategories()
    const html = await templateEngine.render('./Templates/about.html', {categories})
    res.end(html)
})

app.get('/basket', async (req, res) => {
    const categories = await db.getCategories()
    const html = await templateEngine.render('./Templates/basket.html', {categories})
    res.end(html)
})

app.get('/checkout', async (req, res) => {
    const categories = await db.getCategories()
    const html = await templateEngine.render('./Templates/checkout.html', {categories})
    res.end(html)
})

app.get('/completed', async (req, res) => {
    const categories = await db.getCategories()
    const html = await templateEngine.render('./Templates/completed.html', {categories})
    res.end(html)
})


app.get('/admin', async (req, res) => {
    const orders = await db.getOrders()
    const html = await templateEngine.render('./Templates/admin/admin-orders.html', {orders})
    res.end(html)
})
app.get('/admin/products', async (req, res) => {
    const categories = await db.getCategories()
    const products = await db.getAllProducts()
    const html = await templateEngine.render('./Templates/admin/admin-products.html', {categories, products})
    res.end(html)
})
app.get('/admin/categories', async (req, res) => {
    const categories = await db.getCategories()
    const html = await templateEngine.render('./Templates/admin/admin-categories.html', {categories})
    res.end(html)
})


// api
app.post('/api/create_order', async (req, res) => {
    await db.createOrder(req.body)
    res.end()
})


app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}/`)
})


