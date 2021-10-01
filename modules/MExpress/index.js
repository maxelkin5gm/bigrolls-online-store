const http = require('http')
const config = require("../../config")
const jwt = require("jsonwebtoken")
const middlewares = require("./middlewares")


module.exports = class MExpress {
    static middlewares = middlewares

    _routers = {
        GET: {},
        POST: {}
    }

    _middleware = []
    _indexMiddleware = 0


    constructor() {
        this.use(this._createRedirectFunc)
    }

    use(callBack) {
        this._middleware.push(callBack)
    }

    get(url, callBack) {
        this._routers.GET[url] = callBack
    }

    post(url, callBack) {
        this._routers.POST[url] = callBack
    }

    deleteRouter(method, url) {
        delete this._routers[method][url]
    }

    bindRoutersCategories(db, callBack) {
        db.getAllCategories().then((categories) => {
            categories.forEach((category) => {
                callBack(category)
            })
        })
    }

    static verifyToken(req) {
        try {
            const token = req.cookie.token
            const decoded = jwt.verify(token, config.JWT_secret_key)
            if (req.socket.remoteAddress === decoded.host) {
                return decoded
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    static verifyTokenAdmin(req) {
        const result = this.verifyToken(req)
        if (result) {
            if (result.role === 'admin') {
                return result
            } else return false
        } else return false
    }

    _createRedirectFunc(req, res, next) {
        res.redirect = (statusCode, url) => {
            res.statusCode = String(statusCode)
            res.setHeader('Location', url)
            res.end()
        }
        next()
    }

    async routing(req, res) {
        try {
            const url = decodeURIComponent(req.url)
            const routeFunc = this._routers[req.method][url]
            if (routeFunc) {
                await routeFunc(req, res)
            } else {
                res.statusCode = 404
                res.end('<h1>Error 404</h1>')
            }
        } catch (err) {
            console.log(err)
            res.statusCode = 500
            res.end()
        }
    }

    next() {
        const middleware = this._middleware
        this._indexMiddleware++
        const index = this._indexMiddleware
        if (middleware[index]) {
            middleware[index](this.req, this.res, () => this.next())
        } else {
            this.routing(this.req, this.res)
        }
    }

    listen(PORT, callBack) {
        http.createServer(async (req, res) => {
            this._indexMiddleware = 0
            this.req = req
            this.res = res
            if (this._middleware.length) {
                this._middleware[0](req, res, () => this.next())
            } else {
                this.routing(req, res)
            }
        }).listen(PORT)

        callBack()
    }
}