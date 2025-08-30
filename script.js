document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username-input');
    const searchButton = document.getElementById('search-button');
    const profileCard = document.getElementById('profile-card');
    const reposList = document.getElementById('repos-list');
    const errorMessage = document.getElementById('error-message');

    // Profile elements
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const profileLink = document.getElementById('profile-link');
    const followersCount = document.getElementById('followers-count');
    const followingCount = document.getElementById('following-count');
    const reposCount = document.getElementById('repos-count');
    const repoUl = document.getElementById('repo-ul');

    const GITHUB_API_URL = 'https://api.github.com/users/';

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            fetchUserProfile(username);
        }
    });

    async function fetchUserProfile(username) {
        // Reset previous state
        profileCard.classList.add('hidden');
        reposList.classList.add('hidden');
        errorMessage.classList.add('hidden');

        try {
            // Fetch user data
            const userResponse = await fetch(`${GITHUB_API_URL}${username}`);
            if (!userResponse.ok) {
                if (userResponse.status === 404) {
                    throw new Error('User not found.');
                }
                throw new Error('An error occurred. Please try again later.');
            }
            const userData = await userResponse.json();

            // Fetch user repositories
            const reposResponse = await fetch(`${GITHUB_API_URL}${username}/repos`);
            const reposData = await reposResponse.json();

            // Display user profile
            displayProfile(userData);

            // Display repositories
            displayRepos(reposData);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        }
    }

    function displayProfile(user) {
        profileAvatar.src = user.avatar_url;
        profileName.textContent = user.name || user.login;
        profileBio.textContent = user.bio || 'No bio provided.';
        profileLink.href = user.html_url;
        followersCount.textContent = user.followers;
        followingCount.textContent = user.following;
        reposCount.textContent = user.public_repos;

        profileCard.classList.remove('hidden');
    }

    function displayRepos(repos) {
        repoUl.innerHTML = '';
        if (repos.length === 0) {
            const noReposItem = document.createElement('li');
            noReposItem.textContent = 'No public repositories found.';
            repoUl.appendChild(noReposItem);
        } else {
            repos.forEach(repo => {
                const repoItem = document.createElement('li');
                repoItem.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || 'No description provided.'}</p>
                    <p>Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}</p>
                `;
                repoUl.appendChild(repoItem);
            });
        }
        reposList.classList.remove('hidden');
    }
});
