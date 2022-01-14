import BasketModule from './modules/BasketModule.js';



fetch('/api/basket', {
  method: 'GET',
}).then((res) => {
  return res.json();
}).then((data) => {
  BasketModule.basket = data

  BasketModule.renderOrderPrice('.checkout-page__order-price');
  const totalPrice = BasketModule.getTotal();


  const form = document.forms[0];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.forms[0];
    const order = {
      client: {
        name: form.name.value,
        tel: form.tel.value,
        street: form.street.value,
        home: form.home.value,
        apartment: form.apartment.value,
      },

      info: {
        delivery: form.delivery.value,
        additionalInfo: form.info.value,
        totalPrice,
      },

      basket: BasketModule.basket,
    };

    fetch('/api/create_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    }).then((res) => {
      if (res.status === 200) {
        localStorage.removeItem('basket');
        fetch('/api/basket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }).then((res) => {
          BasketModule.basket = {}
          BasketModule.updateIndicator();
        })
        document.querySelector('.checkout-page').innerHTML = '<h1>Спасибо за заказ</h1>';
      } else {
        error.style.display = 'block';
        setTimeout(() => {
          error.style.display = 'none';
        }, 3000);
      }
    });
  });

});
