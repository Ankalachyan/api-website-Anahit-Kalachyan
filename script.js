let allUsers = [];
let countries = new Set();

function renderUsers(users) {
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '';
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'userCard';
        userCard.innerHTML = `
            <img src="${user.picture.medium}" alt="${user.name.first} ${user.name.last}">
            <div class="userText">
                <p class="userName">${user.name.first} ${user.name.last}</p>
                <p class="userEmail">${user.email}</p>
            </div>
            <div class="endPart">
                <div class="friendIcons">
                    <div class="add">
                        <svg viewBox="0 0 64 64" width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" stroke-width="6" stroke="#000000" fill="none">
                            <g id="SVGRepo_iconCarrier">
                                <circle cx="29.22" cy="16.28" r="11.14"></circle>
                                <path d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9"></path>
                                <circle cx="45.38" cy="46.92" r="11.94"></circle>
                                <line x1="45.98" y1="39.8" x2="45.98" y2="53.8"></line>
                                <line x1="38.98" y1="46.8" x2="52.98" y2="46.8"></line>
                            </g>
                        </svg>
                    </div>
                </div>
                <button class="detailsBtn">Details</button>
            </div>
        `;

        const detailsButton = userCard.querySelector('.detailsBtn');
        detailsButton.addEventListener('click', () => showUserDetails(user));

        const addButton = userCard.querySelector('.add');
        addButton.addEventListener('click', () => add(user));

        userListElement.appendChild(userCard);
    });
}

function showUserDetails(user) {
    alert(`
        Name: ${user.name.first} ${user.name.last}
        Email: ${user.email}
        Phone: ${user.phone}
        Location: ${user.location.city}, ${user.location.country}
    `);
}

function filterUsers() {
    const genderFilter = document.getElementById('genderFilter').value;
    const countryFilter = document.getElementById('countryFilter').value;
    const filteredUsers = allUsers.filter(user =>
        (genderFilter === 'all' || user.gender === genderFilter) &&
        (countryFilter === 'all' || user.location.country === countryFilter)
    );

    renderUsers(filteredUsers);
}

function populateCountryFilter() {
    const countryFilter = document.getElementById('countryFilter');
    countryFilter.innerHTML = '<option value="all">All</option>';
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

function add(user) {
    console.log('Add user:', user);
    const userKey = `user_${user.email}`;
    localStorage.setItem(userKey, JSON.stringify(user));
    alert(`
        Friend Added!
    `);
    updateFriendsList();
}
fetch("https://randomuser.me/api/?results=50")
    .then(response => response.json())
    .then(data => {
        allUsers = data.results;
        allUsers.forEach(user => countries.add(user.location.country));
        populateCountryFilter();
        renderUsers(allUsers);
        document.getElementById('genderFilter').addEventListener('change', filterUsers);
        document.getElementById('countryFilter').addEventListener('change', filterUsers);
    })
    .catch(error => {
        console.error('Error:', error);
    });
