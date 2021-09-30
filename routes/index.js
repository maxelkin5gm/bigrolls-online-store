const main = require("./partials/main")
const admin = require("./partials/admin")
const api = require("./partials/api")
const authenticate = require("./partials/authenticate")


module.exports = (app) => {
    main(app)
    admin(app)
    api(app)
    authenticate(app)
}