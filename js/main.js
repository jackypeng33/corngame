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
                games.forEach(game => {
                    gameListContainer.appendChild(createGameCard(game));
                });
            } else {
                gameListContainer.innerHTML = '<p>No games found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing game data:', error);
            gameListContainer.innerHTML = `<p>Error loading games. Please try again later.</p><p><small>${error}</small></p>`;
        });
}

/**
 * Initialize games browsing page
 */
function initGamesPage() {
    const gamesContainer = document.getElementById('games-container');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    
    // Initial state: display all games
    displayGames(games, gamesContainer, noResults);
    
    // Add search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters(searchInput, filterButtons, gamesContainer, noResults);
        });
    }
    
    // Add category filtering functionality
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply filters
                applyFilters(searchInput, filterButtons, gamesContainer, noResults);
            });
        });
    }
    
    // Check if there's a preset category filter in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        // Find and activate the corresponding category button
        const categoryButton = Array.from(filterButtons).find(btn => 
            btn.getAttribute('data-category') === categoryParam
        );
        
        if (categoryButton) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            categoryButton.classList.add('active');
            applyFilters(searchInput, filterButtons, gamesContainer, noResults);
        }
    }
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
        if (gameTitle) gameTitle.textContent = '错误';
        if (errorContainer) errorContainer.textContent = '错误: 缺少游戏 ID。';
        return;
    }

    fetch('games.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(games => {
            const game = games.find(g => g.id === gameId);

            if (game) {
                document.title = `正在玩: ${game.title}`;
                if (gameTitle) gameTitle.textContent = game.title;
                if (gameDescription) gameDescription.textContent = game.description || "没有提供描述。";
                if (gameCategory) gameCategory.textContent = game.categories && game.categories.length > 0 ? game.categories.join(', ') : '通用';

                if (fullscreenLink) fullscreenLink.href = game.gameUrl;
                if (fallbackLink) fallbackLink.href = game.gameUrl;

                if (gameContainer) {
                    const iframe = document.createElement('iframe');
                    iframe.id = 'game-frame';
                    iframe.src = game.gameUrl;
                    iframe.setAttribute('allowfullscreen', '');
                    iframe.setAttribute('frameborder', '0');
                    
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
                if (gameTitle) gameTitle.textContent = '错误';
                if (errorContainer) {
                     errorContainer.textContent = `错误: 找不到 ID 为 "${gameId}" 的游戏。`;
                     errorContainer.classList.remove('hidden');
                }
            }
        })
        .catch(error => {
            console.error('加载游戏数据失败:', error);
            if (gameTitle) gameTitle.textContent = '错误';
            if (errorContainer) {
                errorContainer.textContent = '加载游戏配置失败，请重试。';
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
    
    // In game.json, categories is an array. We'll display the first one.
    const categoryText = game.categories && game.categories.length > 0 ? game.categories[0] : 'General';
    
    const gamePlayUrl = `play.html?id=${encodeURIComponent(game.id)}`;
    
    card.innerHTML = `
        <img src="${game.icon}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/220x150/000/fff?text=No+Image';">
        <div class="game-card-content">
            <h3>${game.title}</h3>
            <span class="category-tag">${categoryText}</span>
            <p>${game.description || ''}</p>
            <a href="${gamePlayUrl}" class="btn">Play Now</a>
        </div>
    `;
    
    return card;
}

/**
 * Display games list
 * @param {Array} gamesToDisplay Array of games to display
 * @param {HTMLElement} container Container element
 * @param {HTMLElement} noResults No results prompt element
 */
function displayGames(gamesToDisplay, container, noResults) {
    // Clear container
    container.innerHTML = '';
    
    // If no matching games, display no results prompt
    if (gamesToDisplay.length === 0) {
        if (noResults) noResults.classList.remove('hidden');
        return;
    }
    
    // Hide no results prompt
    if (noResults) noResults.classList.add('hidden');
    
    // Add game cards to container
    gamesToDisplay.forEach(game => {
        container.appendChild(createGameCard(game));
    });
}

/**
 * Apply filters (search and category)
 * @param {HTMLElement} searchInput Search input box
 * @param {NodeList} filterButtons Filter buttons node list
 * @param {HTMLElement} container Games container
 * @param {HTMLElement} noResults No results prompt
 */
function applyFilters(searchInput, filterButtons, container, noResults) {
    // Get search keyword
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Get currently selected category
    const activeFilterBtn = Array.from(filterButtons).find(btn => btn.classList.contains('active'));
    const selectedCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-category') : 'all';
    
    // Filter games
    let filteredGames = games;
    
    // Filter by category
    if (selectedCategory !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(searchTerm) || 
            game.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Display filtered games
    displayGames(filteredGames, container, noResults);
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
                gameListContainer.innerHTML = '<p>没有找到游戏。</p>';
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
            console.error('无法加载游戏数据:', error);
            gameListContainer.innerHTML = '<p>加载游戏列表失败，请稍后重试。</p>';
        });
}); 