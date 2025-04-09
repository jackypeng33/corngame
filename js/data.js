/**
 * Game data
 * Contains information for all games on the website
 */
const games = [
    {
        id: 1,
        title: "Incredibox Sprunki",
        description: "A creative rhythm game that allows children to create music by combining different sound effects.",
        image: "images/Incredibox.png",
        url: "https://www.gameflare.com/embed/incredibox-sprunki",
        category: "kids"
    },
    {
        id: 2,
        title: "Find the Vampire",
        description: "An exciting action game where you need to find and eliminate vampires.",
        image: "images/Find.jpg",
        url: "https://www.crazygames.com/embed/find-the-vampire",
        category: "action"
    },
    {
        id: 3,
        title: "Bloxd.io",
        description: "A multiplayer building game where you can create and explore worlds with others.",
        image: "images/Bloxd.jpg",
        url: "https://retrogamesonline.io/play/bloxdio",
        category: "multiplayer"
    },
    {
        id: 4,
        title: "Count Masters",
        description: "A casual stickman game where you need to count and collect items.",
        image: "images/Count.jpg",
        url: "https://www.gameflare.com/embed/count-masters/",
        category: "casual"
    },
    {
        id: 5,
        title: "Apple Shooter",
        description: "An action-packed game where you shoot apples at targets.",
        image: "images/Apple.jpg",
        url: "https://www.crazygames.com/embed/apple-shooter",
        category: "action"
    },
    {
        id: 6,
        title: "Mahjongg Solitaire",
        description: "A classic puzzle game where you match and remove tiles.",
        image: "images/Mahjongg.jpg",
        url: "https://mahjong-solitaire.netlify.app",
        category: "puzzle"
    },
    {
        id: 7,
        title: "Playground",
        description: "An action game set in a playground environment.",
        image: "images/Playground.png",
        url: "https://www.crazygames.com/embed/playground",
        category: "action"
    },
    {
        id: 8,
        title: "Warzone Armor",
        description: "An action-packed war game with armored vehicles.",
        image: "images/Warzone.png",
        url: "https://www.crazygames.com/embed/warzone-armor-gtb",
        category: "action"
    }
];

// Categories
const categories = [
    { id: "kids", name: "Kids Games" },
    { id: "action", name: "Action Games" },
    { id: "puzzle", name: "Puzzle Games" },
    { id: "casual", name: "Casual Games" },
    { id: "multiplayer", name: "Multiplayer Games" }
]; 