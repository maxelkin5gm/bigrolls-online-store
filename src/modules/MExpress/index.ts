import {dataToken, middleware, nextFunction, Request, Response, routerCB, routers} from "./Types/Types"
import {IncomingMessage, ServerResponse} from "http"

import http from "http"
import config from "../../config"
import jwt from "jsonwebtoken"
import middlewares from "./middlewares/middlewares"
import Run from "./Run"
import DBHelper from "../DBHealper"
import templateEngine from "../TemplateEngine"
import {CategoryModelType} from "../DBHealper/Models/CategoriesModel";


export default class MExpress {
    static middlewares = middlewares

    _routers: routers = {
        GET: {},
        POST: {}
    }

    private _middlewares: middleware[] = []

    constructor() {
        this.use(this._createRedirectFunc)
        this.use(this._createUrlParseFunc)
    }

    use(callBack: middleware) {
        this._middlewares.push(callBack)
    }

    get(url: string, callBack: routerCB) {
        this._routers.GET[url] = callBack
    }

    post(url: string, callBack: routerCB) {
        this._routers.POST[url] = callBack
    }

    deleteRouter(method: string, url: string) {
        delete this._routers[method][url]
    }

    bindRoutersCategories() {
        DBHelper.getAllCategories().then((categories) => {
            categories.forEach((category) => {
                this.routeCategory(category)
            })
        })
    }

    routeCategory(category: CategoryModelType) {
        this.get(`/${category.name}`, async (req, res) => {
            const categories = await DBHelper.getAllCategories()
            const products = await DBHelper.getProducts(category.name)
            let sort = 0;
            switch (req.url_parts.searchParams.get('sort')) {
                case '1':
                    sort = 1
                    products.sort(function (a: any, b: any) {
                        if (Number(a.price) < Number(b.price)) {
                            return 1;
                        }
                        if (Number(a.price) > Number(b.price)) {
                            return -1;
                        }
                        return 0;
                    });
                    break
                case '2':
                    sort = 2
                    products.sort(function (a: any, b: any) {
                        if (Number(a.price) > Number(b.price)) {
                            return 1;
                        }
                        if (Number(a.price) < Number(b.price)) {
                            return -1;
                        }
                        return 0;
                    });
                    break
            }
            const html = await templateEngine.render('./Views/products.html', {categories, products, sort})
            res.end(html)
        })
    }

    static verifyToken(req: Request): dataToken | false {
        try {
            const token = req.cookie.token
            const decoded = jwt.verify(token, config.JWT_secret_key) as dataToken
            return decoded
        } catch (e) {
            return false
        }
    }

    static verifyTokenAdmin(req: Request): dataToken | false {
        const result = this.verifyToken(req)
        if (result) {
            if (result.role === 'admin') {
                return result
            } else return false
        } else return false
    }

    _createRedirectFunc(req: Request, res: Response, next: nextFunction) {
        res.redirect = (statusCode: number, url: string) => {
            res.statusCode = statusCode
            res.setHeader('Location', url)
            res.end()
        }
        next()
    }

    _createUrlParseFunc(req: Request, res: Response, next: nextFunction) {
        const fullUrl = 'http://' + req.headers.host + req.url
        const url_parts = new URL(fullUrl)

        req.url = url_parts.pathname
        req.url_parts = url_parts
        next()
    }

    listen(callBack: (PORT: number) => void) {
        http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
            new Run(req as Request, res as Response, this._routers, this._middlewares)
        }).listen(Number(config.PORT))
        callBack(Number(config.PORT))
    }
}