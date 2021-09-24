const submitBtn = document.querySelector('button')
const form = document.forms[0]

// create
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('/api/create_category', {
        method: 'POST',
        body: new FormData(form)
    }).then((res) => {
        location.reload()
    })
})

// delete
const deleteBtns = document.querySelectorAll('.category__deleteBtn')

deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        fetch('/api/delete_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({idCategory: btn.dataset.id})
        }).then((res) => {
            location.reload()
        })
    })
})