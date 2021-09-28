module.exports = class CookieHelper {
    static preparedCookie = []

    // middleware
    static getCookie(req, res, next) {
        req.cookie = {}
        const cookie = req.headers.cookie;
        if (!cookie) {
            next()
            return
        }

        const items = cookie.split(';');
        for (const item of items) {
            const parts = item.split('=');
            const key = parts[0].trim();
            const val = parts[1] || '';
            req.cookie[key] = val.trim();
        }
        next()
    }

    static setCookie(name, value) {
        const expires = 'expires=Fri, 01 Jan 2100 00:00:00 GMT';
        let cookie = `${name}=${String(value)}; ${expires}; Path=/; HttpOnly`;
        this.preparedCookie.push(cookie);
    }

    static deleteCookie(name) {
        this.preparedCookie.push(String(name) + '=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/')
    }

    static sendCookie(res) {
        if (this.preparedCookie.length && !res.headersSent) {
            res.setHeader('Set-Cookie', this.preparedCookie);
        }
        this.preparedCookie = []
    }
}