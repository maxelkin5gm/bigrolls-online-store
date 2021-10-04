const http = require('http')
const config = require("../../config")
const jwt = require("jsonwebtoken")
const middlewares = require("./middlewares/middlewares")
const Run = require("./Run");
const url = require("url");


module.exports = class MExpress {
    static middlewares = middlewares

    _routers = {
        GET: {},
        POST: {}
    }
    _middlewares = []

    constructor() {
        this.use(this._createRedirectFunc)
        this.use(this._createUrlParseFunc)
    }

    use(callBack) {
        this._middlewares.push(callBack)
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

    _createUrlParseFunc(req, res, next) {
        const fullUrl = req.protocol + '://' + req.headers.host + req.url;
        const url_parts = new URL(fullUrl)

        req.url = url_parts.pathname
        req.url_parts = url_parts
        next()
    }

    listen(PORT, callBack) {
        http.createServer(async (req, res) => {
            new Run(req, res, this._routers, this._middlewares)
        }).listen(PORT)
        callBack()
    }
}