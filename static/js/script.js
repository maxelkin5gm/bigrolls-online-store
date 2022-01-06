import BasketModule from './modules/BasketModule.js';

BasketModule.updateIndicator();

// menu burger
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');
burger.addEventListener('click', (e) => {
  burger.classList.toggle('active');
  menu.classList.toggle('active');
});
