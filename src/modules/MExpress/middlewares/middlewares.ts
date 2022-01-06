import multiparty from 'multiparty';
import fs from 'fs';
import { NextFunction, Request, Response } from '../Types/Types';

import config from '../../../config';
import CookieHelper from '../../CookieHelper';

export default {

  async getJSON(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers['content-type'] !== 'application/json') {
        next();
      } else {
        const buffers = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        req.json = JSON.parse(data);
        next();
      }
    } catch (err) {
      res.statusCode = 400;
      res.end();
    }
  },

  getFormData(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['content-type']) {
      next();
      return;
    }
    const contentType = req.headers['content-type'].split(';')[0].trim();

    if (contentType === 'multipart/form-data') {
      const form = new multiparty.Form({
        uploadDir: config.uploadImgDir,
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          res.statusCode = 400;
          res.end();
          return;
        }
        const formData: any = {};
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const field in fields) {
          // eslint-disable-next-line prefer-destructuring
          formData[field] = fields[field][0];
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const file in files) {
          if (files[file][0].size === 0) {
            fs.unlinkSync(files[file][0].path);
            formData[file] = config.placeholderURL;
          } else {
            formData[file] = config.staticDir + files[file][0].path;
          }
        }
        req.formData = formData;
        next();
      });
    } else {
      next();
    }
  },

  getCookie(req: Request, res: Response, next: NextFunction) {
    CookieHelper.getCookie(req, res, next);
  },

};
