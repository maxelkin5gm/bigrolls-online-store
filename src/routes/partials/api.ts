import MExpress from "../../modules/MExpress"
import DBHelper from "../../modules/DBHealper"
import categorySchema from "../../modules/Validate/categorySchema";
import productSchema from "../../modules/Validate/productSchema";
import orderSchema from "../../modules/Validate/orderSchema";
import TemplateEngine from "../../modules/TemplateEngine";


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

    app.post('/api/get_categories', async (req, res) => {
        const html = `
        <% categories.forEach(function(category) { %>
            <div class="category">
                <div class="category__info">
                    <img src="<%= category.imgURL %>" alt="">
                    <p><%= category.name %></p>
                </div>
                <a class="category__deleteBtn" data-id="<%= category.id %>" href="">Удалить</a>
            </div>
        <% }) %>`

        const categories = await DBHelper.getAllCategories()
        res.end(TemplateEngine.renderString(html, {categories}))
    })
    app.post('/api/get_products', async (req, res) => {
        const html = `
        <% products.forEach(function(product) { %>
            <div class="product">
                <div class="product__info">
                    <img src="<%= product.imgURL %>" alt="">
                    <p>Название:<br><%= product.name %></p>
                    <p>Цена:<br><%= product.price %> ₽</p>
                    <p>Категория:<br><%= product.category %></p>
                </div>
                <a class="product__deleteBtn" href="" data-imgurl="<%= product.imgURL %>" data-id="<%= product.id %>">Удалить</a>
            </div>
        <% }) %>`

        const products = await DBHelper.getAllProducts()
        res.end(TemplateEngine.renderString(html, {products}))
    })
    app.get('/api/get_orders', async (req, res) => {
        const html = `
        <% orders.forEach(function(order) { %>
            <div class="order">
                <div class="order__header">
                    <h2 class="order__title">Заказ <%= order.id %></h2>
                    <div class="order__buttons">
                        <a data-id="<%= order.id %>" class="order__deleteBtn" href="">Удалить</a>
                    </div>
                </div>
                <hr>
                <h3>Данные клиента:</h3>
                <div class="order__client">
                    <p><strong>Имя: </strong><%= order.client.name %></p>
                    <p><strong>Номер телефона: </strong> <%= order.client.tel %></p>
                    <p><strong>Улица: </strong><%= order.client.street %><strong>, дом:</strong> <%= order.client.home
                        %><strong>, квартира:</strong> <%= order.client.apartment %></p>
                    <p><strong>Доставка: </strong><%= order.info.delivery %></p>
                    <p><strong>Дополнительная информация: </strong><%= order.info.additionalInfo %></p>
                </div>
                <br>
                <hr>
                <h3>Позиции заказа: </h3>
                <div class="order__items">
                    <div class="order__item">
                        <table>
                            <tbody>
                            <tr>
                                <th>Номер</th>
                                <th>Товар</th>
                                <th>Цена</th>
                                <th>Количество</th>
                            </tr>
                            <% for (product in order.basket) { %>
                            <tr>
                                <td><%= product %></td>
                                <td><%= order.basket[product].name %></td>
                                <td><%= order.basket[product].price %></td>
                                <td><%= order.basket[product].amount %></td>
                            </tr>
                            <% } %>
                            </tbody>
                        </table>
                    </div>
                </div>
                <h3>Общая сумма заказа: <%= order.info.totalPrice %> ₽</h3>
            </div>
        <% })%>`

        const result = MExpress.verifyTokenAdmin(req)
        if (result) {
            const orders = await DBHelper.getOrders()
            res.end(TemplateEngine.renderString(html, {orders}))
        } else res.redirect(302, '/login')
    })
}