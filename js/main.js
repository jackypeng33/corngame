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
    // Display featured games (randomly select 3)
    const featuredGamesContainer = document.getElementById('featured-games-container');
    if (featuredGamesContainer) {
        const shuffled = [...games].sort(() => 0.5 - Math.random());
        const featured = shuffled.slice(0, 3);
        
        featured.forEach(game => {
            featuredGamesContainer.appendChild(createGameCard(game));
        });
    }
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
    const gameIframe = document.getElementById('game-iframe');
    const gameTitle = document.getElementById('game-title');
    const gameDescription = document.getElementById('game-description');
    const gameCategory = document.getElementById('game-category');
    
    // Get game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (gameId && gameIframe) {
        // Find game data
        const game = games.find(g => g.id === parseInt(gameId));
        
        if (game) {
            // Update page title
            document.title = `${game.title} - Game Hub`;
            
            // Update game information
            if (gameTitle) gameTitle.textContent = game.title;
            if (gameDescription) gameDescription.textContent = game.description;
            if (gameCategory) {
                let categoryText = getCategoryDisplayName(game.category);
                gameCategory.textContent = `Category: ${categoryText}`;
            }
            
            // Load game into iframe
            gameIframe.src = game.url;
        } else {
            // Game not found
            if (gameTitle) gameTitle.textContent = 'Game Not Found';
            if (gameDescription) gameDescription.textContent = 'Sorry, the requested game does not exist.';
            if (gameCategory) gameCategory.textContent = '';
        }
    } else {
        // No game ID provided
        if (gameTitle) gameTitle.textContent = 'Error';
        if (gameDescription) gameDescription.textContent = 'No game ID specified.';
        if (gameCategory) gameCategory.textContent = '';
    }
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
    
    // Get category display name
    let categoryText = getCategoryDisplayName(game.category);
    
    card.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <div class="game-card-content">
            <h3>${game.title}</h3>
            <span class="category-tag">${categoryText}</span>
            <p>${game.description}</p>
            <a href="play.html?id=${game.id}" class="btn">Play Now</a>
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