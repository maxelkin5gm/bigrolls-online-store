export default class BasketModule {
    static basket = JSON.parse(localStorage.getItem('basket'));

    static indicator = document.querySelector('.basket-menu__indicator');

    static tbody = document.querySelector('tbody');

    static updateIndicator() {
        fetch('/api/basket', {
            method: 'GET',
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.basket = data
            if (this.basket) {
                let count = 0;
                for (const id in this.basket) {
                    count += this.basket[id].amount;
                }
                this.indicator.innerText = String(count);
            } else {
                this.indicator.innerText = '0';
            }
        });
    }

    static isEmpty() {
        return !this.basket || Object.keys(this.basket).length === 0;
    }

    static bindAddBtn(selectorBtn) {
        const buttons = document.querySelectorAll(selectorBtn);
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.add(btn);
                btn.innerText = 'Добавлено';
                setTimeout(() => {
                    btn.innerText = 'В корзину';
                }, 3000);
            });
        });
    }

    static add(btn) {
        const {id} = btn.dataset;
        let basket;
        if (BasketModule.basket) {
            basket = BasketModule.basket;
            if (basket[id]) {
                basket[id].amount++;
            } else {
                basket[id] = {
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    imgURL: btn.dataset.imgurl,
                    amount: 1,
                };
            }
        } else {
            basket = {
                [id]: {
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    imgURL: btn.dataset.imgurl,
                    amount: 1,
                },
            };
        }

        BasketModule.basket = basket;
        this.basket = basket;
        localStorage.setItem('basket', JSON.stringify(basket));
        fetch('/api/basket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(basket),
        }).then((res) => {
            BasketModule.updateIndicator();
        })
    }

    static bindDeleteBtn(selectorBtn) {
        const buttons = document.querySelectorAll(selectorBtn);
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.delete(btn);
                BasketModule.updateIndicator();
            });
        });
    }

    static delete(btn) {
        fetch('/api/basket', {
            method: 'GET',
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.basket = data;
            if (this.basket) {
                const {id} = btn.dataset;
                delete this.basket[id];
                if (Object.keys(this.basket).length === 0) {
                    localStorage.removeItem('basket');
                    fetch('/api/basket', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    }).then((res) => {
                        this.renderBasket()
                        this.updateIndicator()
                        location.reload()
                    })
                } else {
                    localStorage.setItem('basket', JSON.stringify(this.basket));
                    fetch('/api/basket', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.basket),
                    }).then((res) => {
                        this.renderBasket()
                        this.updateIndicator()
                    })
                }
            }
        });
    }

    static getTotal() {
        let count = 0;
        for (const product in this.basket) {
            count += (this.basket[product].price * this.basket[product].amount);
        }
        return count;
    }

    static renderBasket() {
        fetch('/api/basket1', {
            method: 'GET',
        }).then((res) => {
            return res.text();
        }).then((data) => {
            if (data.trim()) this.tbody.innerHTML = data
            BasketModule.bindDeleteBtn('.basket-page__delete');
        });
    }

    static renderOrderPrice(selector) {
        const orderPrice = document.querySelector(selector);
        const total = this.getTotal();
        orderPrice.innerText = `Сумма заказа: ${String(total)} ₽`;
    }
}
