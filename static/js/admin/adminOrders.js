const deleteBtns = document.querySelectorAll('.order__deleteBtn')

deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        fetch('/api/delete_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idOrder: btn.dataset.id})
        }).then((res) => {
            location.reload()
        })
    })
})
