import {nextFunction, Request, Response} from "../Types/Types";

import multiparty from "multiparty"
import config from "../../../config"
import fs from "fs"
import CookieHelper from "../../CookieHelper"


export default {

    getJSON: async function (req: Request, res: Response, next: nextFunction) {
        try {
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
        } catch (err) {
            res.statusCode = 400
            res.end()
        }
    },


    getFormData: function (req: Request, res: Response, next: nextFunction) {
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
                    res.statusCode = 400
                    res.end()
                    return
                }
                const formData: any = {}
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
    },


    getCookie: function (req: Request, res: Response, next: nextFunction) {
        CookieHelper.getCookie(req, res, next)
    },

}