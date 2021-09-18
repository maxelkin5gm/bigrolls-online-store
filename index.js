const MExpress = require('./modules/MExpress')
const config = require("./config")
const TemplateEngine = require("./modules/TemplateEngine")
const DBHelper = require("./modules/DBHealper")

const app = new MExpress()
const templateEngine = new TemplateEngine()
const db = new DBHelper()


app.get('/', async (req, res) => {
    const data = await db.getCategories()
    const html = await templateEngine.render('./Templates/index.html', {people: 'test'})
    res.end(html)
})


app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}/`)
})


