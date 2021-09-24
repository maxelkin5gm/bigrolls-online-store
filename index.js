const MExpress = require('./modules/MExpress')
const config = require("./config")
const TemplateEngine = require("./modules/TemplateEngine")
const DBHelper = require("./modules/DBHealper")


const db = new DBHelper()
const app = new MExpress(db)
const templateEngine = new TemplateEngine()


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
app.initCategories((category) => {
    app.get(`/${category.name}`, async (req, res) => {
        const categories = await db.getAllCategories()
        const products = await db.getProducts(category.name)
        const html = await templateEngine.render('./Templates/products.html', {categories, products})
        res.end(html)
    })
})

app.get('/admin', async (req, res) => {
    const orders = await db.getOrders()
    const html = await templateEngine.render('./Templates/admin/admin-orders.html', {orders})
    res.end(html)
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
    await MExpress.getJSON(req)
    await db.createOrder(req.json)
    res.end()
})
app.post('/api/delete_order', async (req, res) => {
    await MExpress.getJSON(req)
    await db.deleteOrder(req.json.idOrder)
    res.end()
})
app.post('/api/create_category', (req, res) => {
    MExpress.getFormData(req, async (formData) => {
        await db.createCategory(formData)
        app.get(`/${formData.name}`, async (req, res) => {
            const categories = await db.getAllCategories()
            const products = await db.getProducts(formData.name)
            const html = await templateEngine.render('./Templates/products.html', {categories, products})
            res.end(html)
        })
        res.end()
    })
})
app.post('/api/delete_category', async (req, res) => {
    await MExpress.getJSON(req)
    await db.deleteCategory(req.json.idCategory)
    res.end()
})
app.post('/api/create_product', (req, res) => {
    MExpress.getFormData(req, async (formData) => {
        await db.createProduct(formData)
        res.end()
    })
})
app.post('/api/delete_product', async (req, res) => {
    await MExpress.getJSON(req)
    await db.deleteProduct(req.json.idProduct)
    res.end()
})


app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}/`)
})


