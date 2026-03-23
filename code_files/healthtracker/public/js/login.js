const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const data = formToObject(loginForm);

      const { response, result } = await postJson('/login', data);

      if (message) {
        message.textContent = result.message;
      }

      if (response.ok) {
        window.location.href = '/index.html';
      }
    } catch (error) {
      console.error('Login error:', error);

      if (message) {
        message.textContent = 'Something went wrong. Please try again.';
      }
    }
  });
}