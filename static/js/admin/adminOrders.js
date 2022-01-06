function updateBtnListener() {
  const deleteBtns = document.querySelectorAll('.order__deleteBtn');

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      fetch('/api/delete_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idOrder: btn.dataset.id }),
      }).then(() => {
        fetch('/api/get_orders', {
          method: 'GET',
        }).then((res) => {
          document.querySelector('.orders__container').innerHTML = '';
          return res.text();
        }).then((dataHTML) => {
          document.querySelector('.orders__container').innerHTML += dataHTML;
          updateBtnListener();
        });
      });
    });
  });
}

updateBtnListener();
