document.addEventListener('DOMContentLoaded', async () => {
    try{
        const data = await getJson('settings/profile');
        showText('#profile-name', 'Name: ' + data.real_name);
        showText('#profile-email', 'Email: ' + data.email);

    } catch (error){
        console.error('Could not load profile:', error);
    }

    const editProfileButton = document.querySelector('.card-profile button');
    if ( editProfileButton){
        editProfileButton.addEventListener('click', () => {
            goTo('edit-profile.html');
        });

    }

    const changePasswordButton = document.querySelector('.card-security button');
    if ( changePasswordButton){
        changePasswordButton.addEventListener('click', () => {
            goTo('passwordChange.html');
        });
    }
});
