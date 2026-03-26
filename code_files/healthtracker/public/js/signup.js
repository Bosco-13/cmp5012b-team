const signupForm = byId('signupForm');

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = formToObject(signupForm);
  const messageEl = '#message';

  if (
    !formData.real_name ||
    !formData.email ||
    !formData.password ||
    !formData.confirm_password
  ) {
    showText(messageEl, 'Please fill in all fields.');
    return;
  }

  if (formData.password !== formData.confirm_password) {
    showText(messageEl, 'Passwords do not match.');
    return;
  }

  try {
    const { response, result } = await postJson('/signup', {
      real_name: formData.real_name,
      email: formData.email,
      password: formData.password
    });

    showText(messageEl, result.message);

    if (response.ok) {
      signupForm.reset();
      setTimeout(() => {
        goTo('login.html');
      }, 1500);
    }
  } catch (error) {
    console.error('Signup error:', error);
    showText(messageEl, 'Something went wrong. Please try again.');
  }
});