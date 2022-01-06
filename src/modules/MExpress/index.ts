import http, { IncomingMessage, ServerResponse } from 'http';

import jwt from 'jsonwebtoken';
import config from '../../config';
import {
  DataToken, Middleware, NextFunction, Request, Response, RouterCB, Routers,
} from './Types/Types';
import middlewares from './middlewares/middlewares';
import Run from './Run';
// eslint-disable-next-line import/no-cycle
import DBHelper from '../DBHealper';
import templateEngine from '../TemplateEngine';
import { CategoryModelType } from '../DBHealper/Models/CategoriesModel';

export default class MExpress {
  static middlewares = middlewares;

  _routers: Routers = {
    GET: {},
    POST: {},
  };

  private _middlewares: Middleware[] = [];

  constructor() {
    this.use(this._createRedirectFunc);
    this.use(this._createUrlParseFunc);
  }

  use(callBack: Middleware) {
    this._middlewares.push(callBack);
  }

  get(url: string, callBack: RouterCB) {
    this._routers.GET[url] = callBack;
  }

  post(url: string, callBack: RouterCB) {
    this._routers.POST[url] = callBack;
  }

  deleteRouter(method: string, url: string) {
    delete this._routers[method][url];
  }

  bindRoutersCategories() {
    DBHelper.getAllCategories().then((categories) => {
      categories.forEach((category) => {
        this.addRouteCategory(category);
      });
    });
  }

  addRouteCategory(category: CategoryModelType) {
    this.get(`/${category.name}`, async (req, res) => {
      const categories = await DBHelper.getAllCategories();
      const products = await DBHelper.getProducts(category.name);
      let sort = 0;
      switch (req.url_parts.searchParams.get('sort')) {
        case '1':
          sort = 1;
          products.sort((a: any, b: any) => {
            if (Number(a.price) < Number(b.price)) {
              return 1;
            }
            if (Number(a.price) > Number(b.price)) {
              return -1;
            }
            return 0;
          });
          break;
        case '2':
          sort = 2;
          products.sort((a: any, b: any) => {
            if (Number(a.price) > Number(b.price)) {
              return 1;
            }
            if (Number(a.price) < Number(b.price)) {
              return -1;
            }
            return 0;
          });
          break;
        default:
          console.log('default');
      }
      const html = await templateEngine.renderFile('./Views/products.html', { categories, products, sort });
      res.end(html);
    });
  }

  static verifyToken(req: Request): DataToken | false {
    try {
      const { token } = req.cookie;
      const decoded = jwt.verify(token, config.JWT_secret_key) as DataToken;
      return decoded;
    } catch (e) {
      return false;
    }
  }

  static verifyTokenAdmin(req: Request): DataToken | false {
    const result = this.verifyToken(req);
    if (result) {
      if (result.role === 'admin') {
        return result;
      } return false;
    } return false;
  }

  _createRedirectFunc(req: Request, res: Response, next: NextFunction) {
    res.redirect = (statusCode: number, url: string) => {
      res.statusCode = statusCode;
      res.setHeader('Location', url);
      res.end();
    };
    next();
  }

  _createUrlParseFunc(req: Request, res: Response, next: NextFunction) {
    const fullUrl = `http://${req.headers.host}${req.url}`;
    const urlParts = new URL(fullUrl);

    req.url = urlParts.pathname;
    req.url_parts = urlParts;
    next();
  }

  listen(callBack: (PORT: number) => void) {
    http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
      new Run(req as Request, res as Response, this._routers, this._middlewares);
    }).listen(Number(config.PORT));
    callBack(Number(config.PORT));
  }
}
