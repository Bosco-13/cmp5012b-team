document.addEventListener('DOMContentLoaded', async () => {
    try{
        const data = await getJson('settings/preferences');
        byId('theme').value = data.theme || 'light';
        byId('units').value = data.units || 'metric';

    } catch (error) {
        console.error('Could not load preferences:', error);
    }

    byId('save-button').addEventListener('click', async () => {
        const theme = byId('theme').value;
        const units = byId('units').value;

        const{response, result} = await postJson('settings/preferences', {theme: theme, units: units});
        if (!response.ok) {
            showMessage('Failed to save preferences');
            return;
        }
        showMessage('Preferences saved successfully');
        setTimeout(() => goTo('settings.html'),1500);
    });

    byId('cancel-button').addEventListener('click', () => {
        goTo('settings.html');
    });
});

function showMessage(text, type){
    const el = byId('message');
    el.textContent = text;
    el.className = 'message ' + type;
}


