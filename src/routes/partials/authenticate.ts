import jwt from 'jsonwebtoken';

import MExpress from '../../modules/MExpress';
import templateEngine from '../../modules/TemplateEngine';
import DBHelper from '../../modules/DBHealper';
import CookieHelper from '../../modules/CookieHelper';
import config from '../../config';
import loginSchema from '../../modules/Validate/loginSchema';

export default (app: MExpress) => {
  app.get('/login', async (req, res) => {
    const result = MExpress.verifyToken(req);
    if (result) {
      switch (result.role) {
        case 'admin':
          res.redirect(302, '/admin');
          break;
        case 'client':
          res.redirect(302, '/profile');
          break;
        default:
          res.redirect(302, '/');
      }
    } else {
      const html = await templateEngine.renderFile('./Views/login.html', {});
      res.end(html);
    }
  });
  app.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.json);
    if (error) {
      console.log(error);
      res.statusCode = 401;
      res.end();
      return;
    }
    req.json = value;

    const user = await DBHelper.getUserByEmail(req.json.email);
    if (user) {
      if (user.password === req.json.password) {
        const tokenData = {
          id: user.id,
          role: user.role,
          host: req.socket.remoteAddress,
        };
        const token = jwt.sign(tokenData, config.JWT_secret_key);
        CookieHelper.setCookie('token', token);
        CookieHelper.sendCookie(res);
        res.end();
        return;
      }
    }
    res.statusCode = 401;
    res.end();
  });
  app.post('/logout', async (req, res) => {
    CookieHelper.deleteCookie('token');
    CookieHelper.sendCookie(res);
    res.end();
  });
  app.get('/registration', async (req, res) => {
    const result = MExpress.verifyToken(req);
    if (result) {
      switch (result.role) {
        case 'admin':
          res.redirect(302, '/admin');
          break;
        case 'client':
          res.redirect(302, '/profile');
          break;
        default:
          res.redirect(302, '/');
      }
    } else {
      const html = await templateEngine.renderFile('./Views/registration.html', {});
      res.end(html);
    }
  });
  app.post('/registration', async (req, res) => {
    const { error, value } = loginSchema.validate(req.json);
    if (error) {
      console.log(error);
      res.statusCode = 401;
      res.end();
      return;
    }
    req.json = value;
    req.json.role = 'client';

    await DBHelper.createUser(req.json);
    res.end();
  });
};
