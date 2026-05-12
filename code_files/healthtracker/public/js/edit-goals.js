document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await getJson('/settings/goals');
        byId('steps').value = data.steps || '';
        byId('calories').value = data.calories || '';
        byId('sleep').value = data.sleep || '';
    } catch (error) {
        console.error('Could not load goals:', error);
    }

    byId('save-btn').addEventListener('click', async () => {
        const steps = byId('steps').value.trim();
        const calories = byId('calories').value.trim();
        const sleep = byId('sleep').value.trim();
        
        if(!steps) {showMessage('Steps goal cannot be empty.', 'error'); return; }
        if(!calories) {showMessage('Calories goal cannot be empty.', 'error'); return; }
        if(!sleep) {showMessage('Sleep goal cannot be empty.', 'error'); return; }

        const { response, result } = await postJson('/settings/goals', {
            steps: steps,
            calories: calories,
            sleep: sleep
        });

        if (!response.ok) {
            showMessage(result.message || 'Something went wrong.', 'error');
            return;
        }

        showMessage('Goals updated successfully!', 'success');
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
