import BasketModule from './modules/BasketModule.js';

BasketModule.bindAddBtn('.products__basket');

// sort
const select = document.querySelector('#sort');
select.addEventListener('change', (e) => {
  const url_parts = new URL(location.href);
  const url = decodeURIComponent(url_parts.pathname);
  switch (select.selectedIndex) {
    case 0:
      location.href = url;
      break;
    case 1:
      location.href = `${url}?sort=1`;
      break;
    case 2:
      location.href = `${url}?sort=2`;
      break;
  }
});
