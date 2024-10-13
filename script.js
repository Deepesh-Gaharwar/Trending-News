const API_KEY = "b55483c4bdfb40daa1eac132f7d6abf0";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    if (!res.ok) {
        console.error('Network response was not ok');
        return; // Stop execution if response is not okay
    }
    try {
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error('Error parsing JSON data:', error.message);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    // Use a DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = createCard(article);
        fragment.appendChild(cardClone);
    });

    // Clear previous content and append new cards at once
    cardsContainer.innerHTML = "";
    cardsContainer.appendChild(fragment);
}

function createCard(article) {
    const card = document.createElement('div');
    card.classList.add('news-card');
    card.innerHTML = `
        <img class="news-img" src="${article.urlToImage}" alt="News Image">
        <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-desc">${article.description}</p>
            <p class="news-source">${article.source.name} · ${formatDate(article.publishedAt)}</p>
        </div>
    `;
    // Open article in a new tab when card is clicked
    card.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
}

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(navItem => {
    navItem.addEventListener("click", () => {
        const query = navItem.textContent.trim(); // Get text content of nav item as query
        fetchNews(query);
        toggleActiveNav(navItem);
    });
});

function toggleActiveNav(selectedNavItem) {
    const currentActiveNav = document.querySelector('.nav-item.active');
    if (currentActiveNav) {
        currentActiveNav.classList.remove('active');
    }
    selectedNavItem.classList.add('active');
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const searchText = document.getElementById("search-text"); // Assuming you have an input element with this ID

    const search = () => {
        const query = searchText.value.trim(); // Trim whitespace
        if (!query) return;
        fetchNews(query);
        searchText.value = ""; // Clear search input
        toggleActiveNav(null); // Clear active navigation
    };

    searchButton.addEventListener("click", search);
});

//reload page
function reloadPage() {
    location.reload();
}

