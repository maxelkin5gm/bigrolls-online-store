const http = require('http')

module.exports = class MExpress {
    _routers = []

    constructor() {
    }

    get(url, callBack) {
        this._routers.push({
            url,
            method: 'GET',
            callBack
        })
    }

    post(url, callBack) {
        this._routers.push({
            url,
            method: 'POST',
            callBack
        })
    }

    listen(PORT, callBack) {
        http.createServer((req, res) => {
            let isFound = false
            for (let i = 0; i < this._routers.length; ++i) {

                const url = this._routers[i].url
                const method = this._routers[i].method

                if ((decodeURIComponent(req.url) === url) && (req.method === method)) {
                    this._routers[i].callBack(req, res)
                    isFound = true
                    break
                }
            }
            if (!isFound) {
                res.statusCode = 404
                res.end('<h1>Error 404</h1>')
            }

        }).listen(PORT)

        callBack()
    }
}