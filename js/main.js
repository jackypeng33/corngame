/**
 * Main JavaScript file
 * Contains the main functionality of the website: game list display, search, filtering and iframe loading
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Determine current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Execute different initializations based on the current page
    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    } else if (currentPage === 'games.html') {
        initGamesPage();
    } else if (currentPage === 'play.html') {
        initPlayPage();
    }
});

/**
 * Initialize home page
 */
function initHomePage() {
    const gameListContainer = document.getElementById('game-list');
    if (!gameListContainer) return;

    fetch('games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            if (games && games.length > 0) {
                // Display a random selection of games on the home page, e.g., 8 games
                const randomGames = games.sort(() => 0.5 - Math.random()).slice(0, 8);
                randomGames.forEach(game => {
                    gameListContainer.appendChild(createGameCard(game));
                });
            } else {
                gameListContainer.innerHTML = '<p>No games found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing game data:', error);
            gameListContainer.innerHTML = `<p>Error loading games. Please try again later.</p>`;
        });
}

// State for the games page
let allGames = [];
let currentCategory = 'All';
let currentPage = 1;
const gamesPerPage = 12;

async function initGamesPage() {
    const searchInput = document.getElementById('search-input');
    
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allGames = await response.json();
        
        displayCategories();
        renderPage();
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                currentPage = 1; // Reset to first page on new search
                renderPage();
            });
        }
    } catch (error) {
        console.error('Failed to load game data:', error);
        document.getElementById('games-container').innerHTML = '<p>Could not load game data. Please try refreshing the page.</p>';
    }
}

function displayCategories() {
    const filtersContainer = document.getElementById('category-filters');
    if (!filtersContainer) return;

    // Extract unique categories, flatten the array of arrays, and get unique values
    const uniqueCategories = [...new Set(allGames.flatMap(game => game.categories || []))];
    uniqueCategories.sort();

    filtersContainer.innerHTML = ''; // Clear loader
    
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.className = 'active';
    allButton.addEventListener('click', () => {
        currentCategory = 'All';
        currentPage = 1;
        document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
        allButton.classList.add('active');
        renderPage();
    });
    filtersContainer.appendChild(allButton);

    uniqueCategories.forEach(category => {
        if (!category) return; // Skip empty categories
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => {
            currentCategory = category;
            currentPage = 1;
            document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderPage();
        });
        filtersContainer.appendChild(button);
    });
}

function renderPage() {
    const container = document.getElementById('games-container');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // 1. Filter by category
    let filteredGames = allGames;
    if (currentCategory !== 'All') {
        filteredGames = allGames.filter(game => game.categories && game.categories.includes(currentCategory));
    }

    // 2. Filter by search term
    if (searchTerm) {
        filteredGames = filteredGames.filter(game => 
            (game.title && game.title.toLowerCase().includes(searchTerm)) ||
            (game.description && game.description.toLowerCase().includes(searchTerm))
        );
    }
    
    // 3. Paginate
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const gamesForPage = filteredGames.slice(start, end);

    container.innerHTML = '';
    if (gamesForPage.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        gamesForPage.forEach(game => container.appendChild(createGameCard(game)));
    }

    setupPagination(totalPages);
}

function setupPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous Button
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.textContent = '« Prev';
    if (currentPage === 1) {
        prevLink.classList.add('disabled');
    }
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });
    paginationContainer.appendChild(prevLink);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderPage();
        });
        paginationContainer.appendChild(pageLink);
    }

    // Next Button
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.textContent = 'Next »';
    if (currentPage === totalPages) {
        nextLink.classList.add('disabled');
    }
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });
    paginationContainer.appendChild(nextLink);
}

/**
 * Initialize game play page
 */
function initPlayPage() {
    const gameContainer = document.getElementById('game-container');
    const gameTitle = document.getElementById('game-title');
    const gameDescription = document.getElementById('game-description');
    const gameCategory = document.getElementById('game-category');
    const errorContainer = document.getElementById('error-container');
    const iframeFallback = document.getElementById('iframe-fallback');
    const fallbackLink = document.getElementById('fallback-link');
    const fullscreenLink = document.getElementById('fullscreen-link');

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        if (gameTitle) gameTitle.textContent = 'Error';
        if (errorContainer) errorContainer.textContent = 'Error: Missing game ID.';
        return;
    }

    fetch('/games.json') // Using absolute path to be safe
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(games => {
            const game = games.find(g => g.id === gameId);

            if (game) {
                document.title = `Playing: ${game.title}`;
                if (gameTitle) gameTitle.textContent = game.title;
                if (gameDescription) gameDescription.textContent = game.description || "No description provided.";
                if (gameCategory) gameCategory.textContent = game.categories && game.categories.length > 0 ? game.categories.join(', ') : 'General';

                if (fullscreenLink) fullscreenLink.href = game.gameUrl;
                if (fallbackLink) fallbackLink.href = game.gameUrl;

                if (gameContainer) {
                    const iframe = document.createElement('iframe');
                    iframe.id = 'game-frame';
                    iframe.src = game.gameUrl;
                    iframe.setAttribute('allowfullscreen', '');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('scrolling', 'no');
                    
                    iframe.onload = () => {
                        console.log('Iframe loaded successfully.');
                        if(iframeFallback) iframeFallback.classList.add('hidden');
                    };
                    iframe.onerror = () => {
                        console.error('Iframe failed to load.');
                        if(iframeFallback) iframeFallback.classList.remove('hidden');
                    };

                    gameContainer.innerHTML = ''; // Clear loading text
                    gameContainer.appendChild(iframe);
                }
            } else {
                if (gameTitle) gameTitle.textContent = 'Error';
                if (errorContainer) {
                     errorContainer.textContent = `Error: Game with ID "${gameId}" not found.`;
                     errorContainer.classList.remove('hidden');
                }
            }
        })
        .catch(error => {
            console.error('Failed to load game data:', error);
            if (gameTitle) gameTitle.textContent = 'Error';
            if (errorContainer) {
                errorContainer.textContent = 'Failed to load game configuration. Please try again.';
                errorContainer.classList.remove('hidden');
            }
        });
}

/**
 * Get category display name
 * @param {string} category Category code
 * @returns {string} Category display name
 */
function getCategoryDisplayName(category) {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.name : category;
}

/**
 * Create game card element
 * @param {Object} game Game data object
 * @returns {HTMLElement} Game card DOM element
 */
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const categoryText = game.categories && game.categories.length > 0 ? game.categories[0] : 'General';
    const gamePlayUrl = `play.html?id=${encodeURIComponent(game.id)}`;
    
    card.innerHTML = `
        <a href="${gamePlayUrl}" class="game-card-link">
            <img src="${game.icon}" alt="${game.title}" class="game-card-img" onerror="this.onerror=null;this.src='https://via.placeholder.com/220x150/111/fff?text=No+Image';">
            <div class="game-card-content">
                <h3 class="game-card-title">${game.title}</h3>
                <span class="category-tag">${categoryText}</span>
            </div>
        </a>
    `;
    
    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    const gameListContainer = document.getElementById('game-list');

    // Fetch game data from the JSON file
    fetch('games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            if (games.length === 0) {
                gameListContainer.innerHTML = '<p>No games found.</p>';
                return;
            }
            // Clear any existing content
            gameListContainer.innerHTML = '';
            // Create a card for each game
            games.forEach(game => {
                const gameCard = document.createElement('a');
                gameCard.href = `game.html?id=${encodeURIComponent(game.id)}`;
                gameCard.className = 'game-card';

                gameCard.innerHTML = `
                    <img src="${game.icon}" alt="${game.title}" class="game-card__image" onerror="this.src='https://via.placeholder.com/220x150?text=No+Image'">
                    <div class="game-card__content">
                        <h3 class="game-card__title">${game.title}</h3>
                        <p class="game-card__description">${game.description}</p>
                    </div>
                `;
                gameListContainer.appendChild(gameCard);
            });
        })
        .catch(error => {
            console.error('Failed to load game data:', error);
            gameListContainer.innerHTML = '<p>Failed to load game data. Please try again later.</p>';
        });
}); 