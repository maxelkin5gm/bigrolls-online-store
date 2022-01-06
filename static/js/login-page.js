const form = document.forms[0];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  });

  if (res.status === 200) {
    location.href = '/admin';
  } else {
    error.style.display = 'block';
    setTimeout(() => {
      error.style.display = 'none';
    }, 3000);
  }
});
