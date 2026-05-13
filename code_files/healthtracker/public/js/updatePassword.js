document.addEventListener('DOMContentLoaded', () => {
    byId('save-btn').addEventListener('click', async () => {
        const currentPassword = byId('current-password').value.trim();
        const newPassword = byId('new-password').value.trim();
        const confirmPassword = byId('confirm-password').value.trim();

        if(!currentPassword) { showMessage('Current password cannot be empty', 'error'); return; }
        if(!newPassword) { showMessage('New password cannot be empty', 'error'); return; }
        if(!confirmPassword) { showMessage('Please confirm your new password', 'error'); return; }
        if(newPassword !== confirmPassword) { showMessage('New passwords do not match', 'error'); return; }
        
        const {response, result} = await postJson('/settings/password',{
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        });

        if(!response.ok){
            showMessage(result.message || 'Something went wrong', 'error');
            return;
        }

        showMessage('Password updated successfully', 'success');
        setTimeout(() => goTo('settings.html'), 1500);
    });
            
    byId('cancel-btn').addEventListener('click', () => {
        goTo('settings.html');
    });
});

function showMessage(text, type){
    const el = byId('message');
    el.textContent = text;
    el.className = 'message ' + type;
}
