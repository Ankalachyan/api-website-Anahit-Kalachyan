document.addEventListener('DOMContentLoaded', () => {
    const showFriendsBtn = document.getElementById('showFriendsBtn');
    if (showFriendsBtn) {
        showFriendsBtn.addEventListener('click', () => {
            location.assign('./showFriend.html');
        });
    } else {
        console.error('Element with ID "showFriendsBtn" not found.');
    }

    const showUserBtn = document.getElementById('showUser');
    if (showUserBtn) {
        showUserBtn.addEventListener('click', () => {
            location.assign('./index.html');
        });
    } else {
        console.error('Element with ID "showUser" not found.');
    }
});
