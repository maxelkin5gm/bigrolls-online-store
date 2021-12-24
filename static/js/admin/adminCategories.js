
const form = document.forms[0]


function updateBtnListener() {
    const deleteBtns = document.querySelectorAll('.category__deleteBtn')
    deleteBtns.forEach((btn) => {
        function eventL(e) {
            e.preventDefault()

            fetch('/api/delete_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idCategory: btn.dataset.id,
                })
            }).then((res) => {
                fetch('/api/get_categories', {
                    method: 'POST'
                }).then((res) => {
                    document.querySelector('.categories__container').innerHTML = '<h2>Категории:</h2>'
                    return res.text()
                }).then((dataHTML) => {
                    document.querySelector('.categories__container').innerHTML += dataHTML
                    updateBtnListener()
                });
            });
        }
        btn.addEventListener('click', eventL)
    })
}

// delete
updateBtnListener()

// create
form.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch('/api/create_category', {
        method: 'POST',
        body: new FormData(form)
    }).then((res) => {
        fetch('/api/get_categories', {
            method: 'POST'
        }).then((res) => {
            document.querySelector('.categories__container').innerHTML = '<h2>Категории:</h2>'
            return res.text()
        }).then((dataHTML) => {
            document.querySelector('.categories__container').innerHTML += dataHTML
            updateBtnListener()
        });
    });
})
