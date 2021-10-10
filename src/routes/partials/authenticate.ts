import jwt from "jsonwebtoken"

import MExpress from "../../modules/MExpress"
import templateEngine from "../../modules/TemplateEngine"
import DBHelper from "../../modules/DBHealper"
import CookieHelper from "../../modules/CookieHelper"
import config from "../../config"


export default (app: MExpress) => {
    app.get('/login', async (req, res) => {
        const result = MExpress.verifyToken(req)
        if (result) {
            switch (result.role) {
                case 'admin':
                    res.redirect(302, '/admin')
                    break
                case 'client':
                    res.redirect(302, '/profile')
                    break
                default:
                    res.redirect(302, '/')
            }
        } else {
            const html = await templateEngine.render('./Views/login.html', {})
            res.end(html)
        }
    })
    app.post('/login', async (req, res) => {
        const user = await DBHelper.getUserByEmail(req.json.email)
        if (user) {
            if (user.password === req.json.password) {
                const tokenData = {
                    id: user.id,
                    role: user.role,
                    host: req.socket.remoteAddress
                }
                let token = jwt.sign(tokenData, config.JWT_secret_key)
                CookieHelper.setCookie('token', token)
                CookieHelper.sendCookie(res)
                res.end()
            } else {
                res.statusCode = 401
                res.end()
            }
        } else {
            res.statusCode = 401
            res.end()
        }
    })
    app.post('/logout', async (req, res) => {
        CookieHelper.deleteCookie('token')
        CookieHelper.sendCookie(res)
        res.end()
    })
    app.get('/registration', async (req, res) => {
        const result = MExpress.verifyToken(req)
        if (result) {
            switch (result.role) {
                case 'admin':
                    res.redirect(302, '/admin')
                    break
                case 'client':
                    res.redirect(302, '/profile')
                    break
                default:
                    res.redirect(302, '/')
            }
        } else {
            const html = await templateEngine.render('./Views/registration.html', {})
            res.end(html)
        }
    })
    app.post('/registration', async (req, res) => {
        req.json.role = 'client'
        await DBHelper.createUser(req.json)
        res.end()
    })
}