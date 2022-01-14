import MExpress from './modules/MExpress';
import DBHelper from './modules/DBHealper';
import router from './routes';
import TemplateEngine from './modules/TemplateEngine';

const app = new MExpress();
DBHelper.connect();

// middleware
app.use(MExpress.middlewares.getJSON);
app.use(MExpress.middlewares.getFormData);
app.use(MExpress.middlewares.getCookie);

app.post('/api/basket', async (req, res) => {
  await DBHelper.updateBasket(req.json);
  res.end();
});

app.get('/api/basket', async (req, res) => {
  const basket1: any = await DBHelper.getBasket();
  res.end(JSON.stringify(basket1.basket));
});

app.get('/api/basket1', async (req, res) => {
  const html = `
            <tr>
              <th></th>
              <th></th>
              <th>Товар</th>
              <th>Количество</th>
              <th>Цена</th>
            </tr>
        <% for (const product in basket) { %>
            <tr>
                <td data-id="<%= product %>" class="basket-page__delete">X</td>
                <td class="basket-page__img">
                    <img src="<%= basket[product].imgURL %>" alt="productIMG">
                </td>
                <td class="basket-page__name"><%= basket[product].name %></td>
                <td class="basket-page__name"><%= basket[product].amount %></td>
                <td class="basket-page__price"><%= String(basket[product].price) %> ₽</td>
            </tr>
        <% } %>`;
  const basket1: any = await DBHelper.getBasket();
  res.end(TemplateEngine.renderString(html, { basket: basket1.basket }));
});

router(app);
app.bindRoutersCategories();

app.listen((PORT) => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
