export default class BasketModule {
    static basket = JSON.parse(localStorage.getItem('basket'))
    static indicator = document.querySelector('.basket-menu__indicator')
    static tbody = document.querySelector('tbody')
    static orderPrice = document.querySelector('.basket-page__orderPrice')

    constructor() {

    }

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

    static bindAddBtn(selectorBtn) {
        const buttons = document.querySelectorAll(selectorBtn)
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                this.add(btn)
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

    static renderBasket() {
        if (this.basket) {
            let count = 0;
            for (let product in this.basket) {
                const tr = document.createElement('tr')

                const td1 = document.createElement('td')
                td1.classList.add('basket-page__delete')
                td1.setAttribute('data-id', product)
                td1.innerText = 'X'

                const td2 = document.createElement('td')
                td2.classList.add('basket-page__img')
                const img = document.createElement('img')
                img.setAttribute('src', this.basket[product].imgURL)
                td2.append(img)

                const td3 = document.createElement('td')
                td3.classList.add('basket-page__name')
                td3.innerText = this.basket[product].name

                const td4 = document.createElement('td')
                td4.classList.add('basket-page__name')
                td4.innerText = this.basket[product].amount

                const td5 = document.createElement('td')
                td5.classList.add('basket-page__price')
                td5.innerText = String(this.basket[product].price) + ' ₽'

                tr.append(td1, td2, td3, td4, td5)
                this.tbody.append(tr)

                count = count + (this.basket[product].price * this.basket[product].amount)
            }

            this.orderPrice.innerText = 'Сумма заказа: ' + String(count) + ' ₽'
        } else {
            const h2 = document.createElement('h2')
            h2.innerText = 'Корзина пуста'
            this.tbody.append(h2)
        }
    }

    static renderOrderPrice(selector) {
        const orderPrice = document.querySelector(selector)
        if (this.basket) {
            let count = 0;
            for (let product in this.basket) {
                count = count + (this.basket[product].price * this.basket[product].amount)
            }
            orderPrice.innerText = 'Сумма заказа: ' + String(count) + ' ₽'
            return count
        }
    }

}