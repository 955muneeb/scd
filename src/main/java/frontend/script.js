const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const sortSelect = document.getElementById('sortSelect');
const languageSelect = document.getElementById('languageSelect');
const loadingIndicator = document.getElementById('loading');

let currentSearchTerm = '';

async function fetchRepositories(searchTerm, selectedLanguage = '') {
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    loadingIndicator.style.display = 'block';
    resultsContainer.innerHTML = '';

    let query = encodeURIComponent(searchTerm);
    if (selectedLanguage) {
        query += `+language:${encodeURIComponent(selectedLanguage)}`;
    }

    let apiUrl = `https://api.github.com/search/repositories?q=${query}`;

    const selectedSort = sortSelect.value;
    if (selectedSort) {
        apiUrl += `&sort=${selectedSort}&order=desc`;
    }

    apiUrl += '&per_page=20';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            renderResults(data.items);

            if (!selectedLanguage) {
                populateLanguages(data.items);
            }
        } else {
            resultsContainer.innerHTML = '<p>No repositories found.</p>';
            if (!selectedLanguage) {
                languageSelect.innerHTML = '<option value="">All Languages</option>';
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = '<p>Error fetching data. Please try again.</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function renderResults(repositories) {
    resultsContainer.innerHTML = '';

    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('result-item');

        repoElement.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></h3>
            <div class="repo-info">
                <p>⭐ Stars: ${repo.stargazers_count}</p>
                <p>🍴 Forks: ${repo.forks_count}</p>
                <p>🛠️ Language: ${repo.language || 'N/A'}</p>
            </div>
        `;

        resultsContainer.appendChild(repoElement);
    });
}

function populateLanguages(repositories) {
    const languages = new Set();

    repositories.forEach(repo => {
        if (repo.language) {
            languages.add(repo.language);
        }
    });

    languageSelect.innerHTML = '<option value="">All Languages</option>';

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        languageSelect.appendChild(option);
    });
}

searchButton.addEventListener('click', () => {
    currentSearchTerm = searchInput.value.trim();
    fetchRepositories(currentSearchTerm);
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        currentSearchTerm = searchInput.value.trim();
        fetchRepositories(currentSearchTerm);
    }
});

sortSelect.addEventListener('change', () => {
    if (currentSearchTerm) {
        const selectedLanguage = languageSelect.value;
        fetchRepositories(currentSearchTerm, selectedLanguage);
    }
});

languageSelect.addEventListener('change', () => {
    if (currentSearchTerm) {
        const selectedLanguage = languageSelect.value;
        fetchRepositories(currentSearchTerm, selectedLanguage);
    }
});
