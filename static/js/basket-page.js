import BasketModule from "./modules/BasketModule.js";

// hide button confirm
if (BasketModule.isEmpty()) {
    document.querySelector('.basket-page__confirmBtn').style.display = 'none'
}

BasketModule.renderBasket()
BasketModule.bindDeleteBtn('.basket-page__delete')