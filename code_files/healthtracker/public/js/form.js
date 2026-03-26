const profileForm = document.getElementById('profileForm');
const message = document.getElementById('message');

if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const data = formToObject(profileForm);
      const { response, result } = await postJson('/profile', data);

      if (message) {
        message.textContent = result.message;
      }

      if (response.ok) {
        window.location.href = '/index.html';
      }
    } catch (error) {
      console.error('Profile setup error:', error);

      if (message) {
        message.textContent = 'Something went wrong. Please try again.';
      }
    }
  });
}