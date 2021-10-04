module.exports = class Run {
    _indexMiddleware = 0

    constructor(req, res, routers, middlewares) {
        this._req = req;
        this._res = res;
        this._routers = routers;
        this._middlewares = middlewares;

        this.run()
    }

    async run() {
        if (this._middlewares.length) {
            this._middlewares[0](this._req, this._res, () => this.next())
        } else {
            this.routing(this._req, this._res)
        }
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
        const middleware = this._middlewares
        this._indexMiddleware++
        const index = this._indexMiddleware

        if (middleware[index]) {
            middleware[index](this._req, this._res, () => this.next())
        } else {
            this.routing(this._req, this._res)
        }
    }
}