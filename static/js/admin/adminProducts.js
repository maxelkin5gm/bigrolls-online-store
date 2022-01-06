const form = document.forms[0];

function updateBtnListener() {
  const deleteBtns = document.querySelectorAll('.product__deleteBtn');
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      fetch('/api/delete_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idProduct: btn.dataset.id,
          imgURL: btn.dataset.imgurl,
        }),
      }).then(() => {
        fetch('/api/get_products', {
          method: 'POST',
        }).then((res) => {
          document.querySelector('.products__container').innerHTML = '<h2>Продукты:</h2>';
          return res.text();
        }).then((dataHTML) => {
          document.querySelector('.products__container').innerHTML += dataHTML;
          updateBtnListener();
        });
      });
    });
  });
}

// delete
updateBtnListener();

// create
form.addEventListener('submit', (e) => {
  e.preventDefault();

  fetch('/api/create_product', {
    method: 'POST',
    body: new FormData(form),
  }).then(() => {
    fetch('/api/get_products', {
      method: 'POST',
    }).then((res) => {
      document.querySelector('.products__container').innerHTML = '<h2>Продукты:</h2>';
      return res.text();
    }).then((dataHTML) => {
      document.querySelector('.products__container').innerHTML += dataHTML;
      updateBtnListener();
    });
  });
});
