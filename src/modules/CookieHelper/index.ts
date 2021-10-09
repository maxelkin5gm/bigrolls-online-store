import {Request, Response, nextFunction} from "../MExpress/Types/Types"


export default class CookieHelper {
    static preparedCookie: string[] = []

    static setCookie(name: string, value: string): void {
        const expires = 'expires=Fri, 01 Jan 2100 00:00:00 GMT'
        let cookie: string = `${name}=${value}; ${expires}; Path=/; HttpOnly`
        this.preparedCookie.push(cookie)
    }

    static deleteCookie(name: string): void {
        this.preparedCookie.push(String(name) + '=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/')
    }

    static sendCookie(res: Response): void {
        if (this.preparedCookie.length && !res.headersSent) {
            res.setHeader('Set-Cookie', this.preparedCookie)
        }
        this.preparedCookie = []
    }

    // middleware
    static getCookie(req: Request, res: Response, next: nextFunction): void {
        req.cookie = {}
        const cookie = req.headers.cookie
        if (!cookie) {
            next()
            return
        }

        const items = cookie.split(';')
        for (const item of items) {
            const parts = item.split('=')
            const key = parts[0].trim()
            const val = parts[1] || ''
            req.cookie[key] = val.trim()
        }
        next()
    }
}