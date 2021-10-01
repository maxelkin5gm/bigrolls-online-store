export default class BasketModule {
    static basket = JSON.parse(localStorage.getItem('basket'))
    static indicator = document.querySelector('.basket-menu__indicator')
    static tbody = document.querySelector('tbody')


    static updateIndicator() {
        if (this.basket) {
            let count = 0;
            for (let id in this.basket) {
                count = count + this.basket[id].amount
            }
            this.indicator.innerText = String(count)
        } else {
            this.indicator.innerText = '0'
        }
    }

    static isEmpty() {
        return !this.basket || Object.keys(this.basket).length === 0;
    }

    static bindAddBtn(selectorBtn) {
        const buttons = document.querySelectorAll(selectorBtn)
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                this.add(btn)
                btn.innerText = 'Добавлено'
                setTimeout(() => {
                    btn.innerText = 'В корзину'
                }, 3000)
                BasketModule.updateIndicator()
            })
        })
    }

    static add(btn) {
        const id = btn.dataset.id
        let basket;
        if (BasketModule.basket) {
            basket = BasketModule.basket
            if (basket[id]) {
                basket[id].amount++
            } else {
                basket[id] = {
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    imgURL: btn.dataset.imgurl,
                    amount: 1
                }
            }
        } else {
            basket = {
                [id]: {
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    imgURL: btn.dataset.imgurl,
                    amount: 1
                }
            }
        }

        BasketModule.basket = basket
        localStorage.setItem('basket', JSON.stringify(basket))
    }

    static bindDeleteBtn(selectorBtn) {
        const buttons = document.querySelectorAll(selectorBtn)
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                this.delete(btn)
                BasketModule.updateIndicator()
            })
        })
    }

    static delete(btn) {
        if (this.basket) {
            const id = btn.dataset.id
            delete this.basket[id]
            if (Object.keys(this.basket).length === 0) {
                delete this.basket
                localStorage.removeItem('basket')
            } else {
                localStorage.setItem('basket', JSON.stringify(this.basket))
            }
            location.reload()
        }
    }

    static getTotal() {
        let count = 0;
        for (let product in this.basket) {
            count = count + (this.basket[product].price * this.basket[product].amount)
        }
        return count
    }

    static renderBasket() {
        if (this.basket) {
            for (let product in this.basket) {
                const tr = `
                <tr>
                    <td data-id="${product}" class="basket-page__delete">X</td>
                    <td class="basket-page__img">
                        <img src="${this.basket[product].imgURL}" alt="productIMG">
                    </td>
                    <td class="basket-page__name">${this.basket[product].name}</td>
                    <td class="basket-page__name">${this.basket[product].amount}</td>
                    <td class="basket-page__price">${String(this.basket[product].price) + ' ₽'}</td>
                </tr>`
                this.tbody.innerHTML += tr
            }
            this.renderOrderPrice('.basket-page__orderPrice')
        } else {
            this.tbody.innerHTML = `<h2 style="text-align: center">Корзина пуста</h2>`
        }
    }

    static renderOrderPrice(selector) {
        const orderPrice = document.querySelector(selector)
        const total = this.getTotal()
        orderPrice.innerText = 'Сумма заказа: ' + String(total) + ' ₽'
    }

}