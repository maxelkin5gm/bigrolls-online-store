const MExpress = require('./modules/MExpress')
const config = require("./config");
const TemplateEngine = require("./modules/TemplateEngine");


const app = new MExpress()
const templateEngine = new TemplateEngine()



app.get('/', (req, res) => {
    res.end(templateEngine.render('./Templates/index.html', { title: 'Online Store' }))
})



app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}/`)
})


