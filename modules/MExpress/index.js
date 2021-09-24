const http = require('http')
const multiparty = require("multiparty");
const config = require("../../config");
const fs = require("fs");


module.exports = class MExpress {
    _routers = []

    constructor(db) {
        this.db = db
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

    static async getJSON(req) {
        const buffers = []
        for await (const chunk of req) {
            buffers.push(chunk)
        }
        const data = Buffer.concat(buffers).toString()
        const json = JSON.parse(data)
        req.json = json
        return json
    }

    static getFormData(req, callBack) {
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

            callBack(formData)
        })
    }

    initCategories(callBack) {
        this.db.getAllCategories().then((categories) => {
            categories.forEach((category) => {
                callBack(category)
            })
        })
    }

    listen(PORT, callBack) {
        http.createServer(async (req, res) => {
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