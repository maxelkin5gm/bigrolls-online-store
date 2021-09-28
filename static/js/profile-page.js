const logoutBtn = document.querySelector('.profile-page__logoutBtn')

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('/logout', {
        method: 'POST',
    }).then((res) => {
        location.reload()
    })
})