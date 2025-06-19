document.addEventListener('DOMContentLoaded', () => {
    const gameDetailContainer = document.getElementById('game-detail');
    
    // Get the game ID from the URL query parameter
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        gameDetailContainer.innerHTML = '<h1>错误</h1><p>未指定游戏 ID。</p><a href="index.html">返回大厅</a>';
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
                    <p><strong>分类:</strong> ${game.categories.join(', ')}</p>
                    <a href="play.html?id=${encodeURIComponent(game.id)}" class="btn">立即畅玩</a>
                    <a href="index.html" class="btn" style="background-color: #6c757d;">返回大厅</a>
                `;
            } else {
                gameDetailContainer.innerHTML = '<h1>错误</h1><p>未找到该游戏。</p><a href="index.html">返回大厅</a>';
            }
        })
        .catch(error => {
            console.error('无法加载游戏详情:', error);
            gameDetailContainer.innerHTML = '<h1>错误</h1><p>加载游戏信息失败。</p><a href="index.html">返回大厅</a>';
        });
}); 