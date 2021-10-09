import {middleware, Request, Response, routers} from "./Types/Types";


export default class Run {
    _indexMiddleware = 0

    constructor(
        private _req: Request,
        private _res: Response,
        private _routers: routers,
        private _middlewares: middleware[]
    ) {
        this.run()
    }

    run() {
        if (this._middlewares.length) {
            this._middlewares[0](this._req, this._res, () => this.next())
        } else {
            this.routing(this._req, this._res)
        }
    }

    async routing(req: Request, res: Response) {
        try {
            const url = decodeURIComponent(req.url as string)
            const method = req.method as string
            const routeFunc = this._routers[method][url]
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
        this._indexMiddleware++

        const middlewares = this._middlewares
        const index = this._indexMiddleware

        if (middlewares[index]) {
            middlewares[index](this._req, this._res, () => this.next())
        } else {
            this.routing(this._req, this._res)
        }
    }
}