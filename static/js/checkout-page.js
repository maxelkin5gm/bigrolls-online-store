import BasketModule from "./modules/BasketModule.js";


BasketModule.renderOrderPrice('.checkout-page__order-price')
const totalPrice = BasketModule.getTotal()

const form = document.forms[0]
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const form = document.forms[0]
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
            totalPrice: totalPrice
        },

        basket: JSON.parse(localStorage.getItem('basket'))
    }

    fetch('/api/create_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(order)
    }).then((res) => {
        localStorage.removeItem('basket')
        location.href = '/completed'
    })
})

