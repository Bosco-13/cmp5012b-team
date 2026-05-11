document.addEventListener('DOMContentLoaded', async () => {
    // Load current name & email from database
    try {
        const data = await getJson('/settings/profile');
        byId('name').value = data.real_name || '';
        byId('email').value = data.email || '';
    } catch (error) {
        console.error('Could not load profile data:', error);
    }

    byId('save-btn').addEventListener('click', async () => {
        const name = byId('name').value.trim();
        const email = byId('email').value.trim();

        if (!name) { showMessage('Name cannot be empty.', 'error'); return; }
        if (!email || !email.includes('@')) { showMessage('Invalid email.', 'error'); return; }

        const { response, result } = await postJson('/settings/profile', {
            real_name: name,
            email: email
        });

        if (!response.ok) {
            showMessage(result.message || 'Something went wrong.', 'error');
            return;
        }

        showMessage('Profile updated successfully!', 'success');
        setTimeout(() => goTo('settings.html'), 1500);
    });

    byId('cancel-btn').addEventListener('click', () => {
        goTo('settings.html');
    });
});

function showMessage(text, type) {
    const el = byId('message');
    el.textContent = text;
    el.className = 'message ' + type;
}
