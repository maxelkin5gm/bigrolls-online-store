import MExpress from "./modules/MExpress"
import DBHelper from "./modules/DBHealper"
import router from "./routes"


const app = new MExpress()
DBHelper.connect()


// middleware
app.use(MExpress.middlewares.getJSON)
app.use(MExpress.middlewares.getFormData)
app.use(MExpress.middlewares.getCookie)


router(app)
app.bindRoutersCategories()


app.listen((PORT) => {
    console.log(`Server running at http://localhost:${PORT}/`);
})
