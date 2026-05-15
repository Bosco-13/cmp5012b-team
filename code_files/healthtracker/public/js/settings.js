document.addEventListener('DOMContentLoaded', async () => {
    try{
        const data = await getJson('settings/profile');
        showText('#profile-name', 'Name: ' + data.real_name);
        showText('#profile-email', 'Email: ' + data.email);

        const goals = await getJson('settings/goals');
        console.log(goals);
        showText('#goals-steps', 'Steps: ' + (goals.steps || 'Not set'));
        showText('#goals-calories', 'Calories: ' + (goals.calories || 'Not set'));
        showText('#goals-sleep', 'Sleep (hours): ' + (goals.sleep || 'Not set'));

        const preferences = await getJson('settings/preferences');
        showText('#preferences-theme', 'Theme: ' + (preferences.theme || 'light'));
        showText('#preferences-units', 'Units: ' + (preferences.units || 'metric'));
        
    } catch (error){
        console.error('Could not load profile:', error);
    }

    const editProfileButton = document.querySelector('.card-profile button');
    if ( editProfileButton){
        editProfileButton.addEventListener('click', () => {
            goTo('edit-profile.html');
        });

    }

    const editGoalsButton = document.querySelector('.card-goals button');
    if ( editGoalsButton){
        editGoalsButton.addEventListener('click', () => {
            goTo('edit-goals.html');
        });
    }

    const preferencesButton = document.querySelector('.card-preferences button');
    if ( preferencesButton){
        preferencesButton.addEventListener('click', () => {
            goTo('preferences.html');
        });
    }

    const changePasswordButton = document.querySelector('.card-security button');
    if ( changePasswordButton){
        changePasswordButton.addEventListener('click', () => {
            goTo('passwordChange.html');
        });
    }

    const deleteAccountButton = document.querySelector('.card-account button');
    if(deleteAccountButton){
        deleteAccountButton.addEventListener('click', async() => {
            const confirmed = confirm('This is irreversible, are you sure you want to delete?');
            if(!confirmed) return;

            const{response, result} = await postJson('/settings/account/delete', {});

            if(!response.ok){
                alert(result.message || 'Could not delete account');
                return;
            }
            window.location.href = 'login.html';
        })
    }
});
