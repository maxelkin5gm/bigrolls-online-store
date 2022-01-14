import BasketModule from './modules/BasketModule.js';


fetch('/api/basket', {
  method: 'GET',
}).then((res) => {
  return res.json();
}).then((data) => {
  BasketModule.basket = data

  if (BasketModule.isEmpty()) {
    document.querySelector('.basket-page__confirmBtn').style.display = 'none';
  }

  BasketModule.renderBasket();
  BasketModule.renderOrderPrice('.basket-page__orderPrice');

});

