const http = require('http')
const multiparty = require("multiparty")
const config = require("../../config")
const fs = require("fs")


module.exports = class MExpress {
    _routers = {
        GET: {},
        POST: {}
    }

    _middleware = []
    _indexMiddleware = 0


    constructor() {
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

    static async getJSON(req, res, next) {
        if (req.headers['content-type'] !== 'application/json') {
            next()
        } else {
            const buffers = []
            for await (const chunk of req) {
                buffers.push(chunk)
            }
            const data = Buffer.concat(buffers).toString()
            req.json = JSON.parse(data)
            next()
        }
    }

    static getFormData(req, res, next) {
        if (!req.headers['content-type']) {
            next()
            return
        }
        const contentType = req.headers['content-type'].split(';')[0].trim()

        if (contentType === 'multipart/form-data') {
            const form = new multiparty.Form({
                uploadDir: config.uploadImgDir
            })

            form.parse(req, function (err, fields, files) {
                if (err) {
                    console.log(err)
                    return
                }
                const formData = {}
                for (let field in fields) {
                    formData[field] = fields[field][0]
                }
                for (let file in files) {
                    if (files[file][0].size === 0) {
                        fs.unlinkSync(files[file][0].path)
                        formData[file] = config.placeholderURL
                    } else {
                        formData[file] = config.staticDir + files[file][0].path
                    }
                }
                req.formData = formData
                next()
            })
        } else {
            next()
        }
    }

    bindRoutersCategories(db, callBack) {
        db.getAllCategories().then((categories) => {
            categories.forEach((category) => {
                callBack(category)
            })
        })
    }

    routing(req, res) {
        const url = decodeURIComponent(req.url)
        const routeFunc = this._routers[req.method][url]
        if (routeFunc) {
            routeFunc(req, res)
        } else {
            res.statusCode = 404
            res.end('<h1>Error 404</h1>')
        }
    }

    next() {
        const middleware = this._middleware

        this._indexMiddleware++
        const index = this._indexMiddleware
        if (middleware[index]) {
            middleware[index](this.req, this.res, () => this.next() )
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
                this._middleware[0](req, res, ()=> this.next())
            } else {
                this.routing(req, res)
            }
        }).listen(PORT)

        callBack()
    }
}