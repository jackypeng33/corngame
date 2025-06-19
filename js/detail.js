document.addEventListener('DOMContentLoaded', () => {
    const gameDetailContainer = document.getElementById('game-detail');
    
    // Get the game ID from the URL query parameter
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        gameDetailContainer.innerHTML = '<h1>Error</h1><p>No game ID specified.</p><a href="index.html">Back to Home</a>';
        return;
    }

    // Fetch all games and find the one with the matching ID
    fetch('games.json')
        .then(response => response.json())
        .then(games => {
            const game = games.find(g => g.id === gameId);

            if (game) {
                // Populate the detail page with game data
                document.title = game.title; // Update the page title
                gameDetailContainer.innerHTML = `
                    <h1>${game.title}</h1>
                    <img src="${game.icon}" alt="${game.title}" class="game-detail__image" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
                    <p>${game.description}</p>
                    <p><strong>Categories:</strong> ${game.categories.join(', ')}</p>
                    <a href="play.html?id=${encodeURIComponent(game.id)}" class="btn">Play Now</a>
                    <a href="index.html" class="btn" style="background-color: #6c757d;">Back to Home</a>
                `;
            } else {
                gameDetailContainer.innerHTML = '<h1>Error</h1><p>Game not found.</p><a href="index.html">Back to Home</a>';
            }
        })
        .catch(error => {
            console.error('Failed to load game details:', error);
            gameDetailContainer.innerHTML = '<h1>Error</h1><p>Failed to load game information.</p><a href="index.html">Back to Home</a>';
        });
}); 