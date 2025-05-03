import CONFIG from "./config";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
    const res = await fetch(`${CONFIG.API_URL}${query}&apiKey=${CONFIG.API_KEY}`);
    if (!res.ok) {
        console.error('Network response was not ok');
        return; 
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
    
    const fragment = document.createDocumentFragment();

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = createCard(article);
        fragment.appendChild(cardClone);
    });

    
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
        const query = navItem.textContent.trim(); 
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
    const searchText = document.getElementById("search-text"); 

    const search = () => {
        const query = searchText.value.trim(); 
        if (!query) return;
        fetchNews(query);
        searchText.value = ""; 
        toggleActiveNav(null); 
    };

    searchButton.addEventListener("click", search);
});


function reloadPage() {
    location.reload();
}

