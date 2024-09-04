let allUsers = [];
let countries = new Set();

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

async function add(user) {
    console.log('Add user:', user);
    const userKey = `user_${user.email}`;
    localStorage.setItem(userKey, JSON.stringify(user));
    await updateFriendsList();
}

async function updateFriendsList() {
    const friendListElement = document.getElementById('friendList');
    if (!friendListElement) {
        console.error('Element with ID "friendList" not found.');
        return;
    }
    friendListElement.innerHTML = ''; 

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('user_')) {
            const user = JSON.parse(localStorage.getItem(key));
            if (!user) {
                console.error(`User data for key ${key} is not valid.`);
                return;
            }

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
                        <div class="remove">
                            <svg fill="#000000" width="33px" height="33px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2,21h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM23,16a1,1,0,0,1-1,1H15a1,1,0,0,1,0-2h7A1,1,0,0,1,23,16Z" />
                            </svg>
                        </div>
                    </div>
                    <button class="detailsBtn">Details</button>
                </div>
            `;

            const detailsButton = userCard.querySelector('.detailsBtn');
            if (detailsButton) {
                detailsButton.addEventListener('click', () => showUserDetails(user));
            }

            const removeButton = userCard.querySelector('.remove');
            if (removeButton) {
                removeButton.addEventListener('click', () => remove(user));
            }

            friendListElement.appendChild(userCard);
        }
    });
}

async function remove(user) {
    console.log('Remove user:', user);

    const userKey = `user_${user.email}`;
    localStorage.removeItem(userKey);

    await updateFriendsList();
}

async function fetchData() {
    try {
        const response = await fetch("https://randomuser.me/api/?results=50");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allUsers = data.results;
        allUsers.forEach(user => countries.add(user.location.country));
        populateCountryFilter();
        await updateFriendsList();
        document.getElementById('genderFilter').addEventListener('change', filterUsers);
        document.getElementById('countryFilter').addEventListener('change', filterUsers);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Start the data fetching process
fetchData();
