const MExpress = require("./modules/MExpress")
const DBHelper = require("./modules/DBHealper")
const config = require("./config")
const router = require('./routes')

const app = new MExpress()
DBHelper.connect()


// middleware
app.use(MExpress.middlewares.getJSON)
app.use(MExpress.middlewares.getFormData)
app.use(MExpress.middlewares.getCookie)


router(app)


app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}/`)
})


