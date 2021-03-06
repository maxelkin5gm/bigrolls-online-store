import MExpress from '../../modules/MExpress';
import templateEngine from '../../modules/TemplateEngine';
import DBHelper from '../../modules/DBHealper';
import CookieHelper from '../../modules/CookieHelper';

export default (app: MExpress) => {
  app.get('/', async (req, res) => {
    const categories = await DBHelper.getAllCategories();
    const html = await templateEngine.renderFile('./Views/categories.html', { categories });
    res.end(html);
  });
  app.get('/about', async (req, res) => {
    const categories = await DBHelper.getAllCategories();
    const html = await templateEngine.renderFile('./Views/about.html', { categories });
    res.end(html);
  });
  app.get('/basket', async (req, res) => {
    const categories = await DBHelper.getAllCategories();
    const html = await templateEngine.renderFile('./Views/basket.html', { categories });
    res.end(html);
  });
  app.get('/checkout', async (req, res) => {
    const categories = await DBHelper.getAllCategories();
    const html = await templateEngine.renderFile('./Views/checkout.html', { categories });
    res.end(html);
  });
  app.get('/completed', async (req, res) => {
    const categories = await DBHelper.getAllCategories();
    const html = await templateEngine.renderFile('./Views/completed.html', { categories });
    res.end(html);
  });
  app.get('/profile', async (req, res) => {
    const result = MExpress.verifyToken(req);
    if (result) {
      const user = await DBHelper.getUserById(result.id);
      if (user) {
        const orders = await DBHelper.getOrdersByUser(user);
        const categories = await DBHelper.getAllCategories();
        const html = await templateEngine.renderFile('./Views/profile.html', { categories, user, orders });
        res.end(html);
        return;
      }
    }
    CookieHelper.deleteCookie('token');
    CookieHelper.sendCookie(res);
    res.redirect(302, '/login');
  });
};
