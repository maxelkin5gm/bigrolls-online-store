const form = document.forms[0]

// create
form.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch('/api/create_product', {
        method: 'POST',
        body: new FormData(form)
    }).then((res) => {
        location.reload()
    })
})

// delete
const deleteBtns = document.querySelectorAll('.product__deleteBtn')

deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        fetch('/api/delete_product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idProduct: btn.dataset.id,
                imgURL: btn.dataset.imgurl
            })
        }).then((res) => {
            location.reload()
        })
    })
})