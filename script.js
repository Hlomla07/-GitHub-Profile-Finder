const searchForm = document.getElementById('search-form');
const usernameInput = document.getElementById('username-input');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const profileDiv = document.getElementById('profile');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
        showError('Please enter a GitHub username');
        return;
    }

    // Show loading, hide previous results
    loading.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    profileDiv.classList.add('hidden');

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found. Please check the username.');
            } else {
                throw new Error('Something went wrong. Please try again later.');
            }
        }

        const data = await response.json();
        displayProfile(data);

    } catch (error) {
        showError(error.message);
    } finally {
        loading.classList.add('hidden');
    }
});

function displayProfile(user) {
    profileDiv.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}">
        <h2>${user.name || user.login}</h2>
        <p class="username">@${user.login}</p>
        <p class="bio">${user.bio || 'No bio available'}</p>

        <div class="stats">
            <div class="stat">
                <strong>${user.followers}</strong>
                <span>Followers</span>
            </div>
            <div class="stat">
                <strong>${user.following}</strong>
                <span>Following</span>
            </div>
            <div class="stat">
                <strong>${user.public_repos}</strong>
                <span>Repos</span>
            </div>
        </div>

        <p><strong>Location:</strong> ${user.location || 'Not specified'}</p>
        <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
    `;

    profileDiv.classList.remove('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}