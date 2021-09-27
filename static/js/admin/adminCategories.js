const form = document.forms[0]

// create
form.addEventListener('submit', (e) => {
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCategory: btn.dataset.id,
                nameCategory: btn.dataset.name,
                imgURL: btn.dataset.imgurl
            })
        }).then((res) => {
            location.reload()
        })
    })
})