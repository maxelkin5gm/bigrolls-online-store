const deleteBtns = document.querySelectorAll('.order__deleteBtn')

deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        fetch('/api/delete_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({idOrder: btn.dataset.id})
        }).then((res) => {
            location.reload()
        })
    })
})
