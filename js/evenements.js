const eventGrid = document.getElementById('eventGrid');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const filtreBtns = document.querySelectorAll('.filtre');
const filtreDateBtns = document.querySelectorAll('.filtre-date');
const viewBtns = document.querySelectorAll('.view-btn');
const resultCount = document.getElementById('resultCount');
const searchSuggestions = document.getElementById('searchSuggestions');

let currentFilter = 'all';
let currentDateFilter = 'all';
let currentSearch = '';
let currentPage = 1;
const itemsPerPage = 6;
let allEvents = [];

// pran evenman yo
function getAllEvents() {
    return Array.from(document.querySelectorAll('.event-card'));
}

function filterEvents() {
    allEvents = getAllEvents();
    
    return allEvents.filter(card => {
        const category = card.dataset.category || '';
        const matchCategory = currentFilter === 'all' || category === currentFilter;
        
        const date = card.dataset.date || '';
        const matchDate = filterByDate(date, currentDateFilter);
        
        const title = card.querySelector('.card-body h3')?.textContent?.toLowerCase() || '';
        const desc = card.querySelector('.card-body p')?.textContent?.toLowerCase() || '';
        const searchTerm = currentSearch.toLowerCase().trim();
        const matchSearch = !searchTerm || 
            title.includes(searchTerm) || 
            desc.includes(searchTerm);
        
        return matchCategory && matchDate && matchSearch;
    });
}

function filterByDate(dateStr, filterType) {
    if (filterType === 'all' || !dateStr) return true;
    
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch(filterType) {
        case 'today': return diffDays === 0;
        case 'week': return diffDays >= 0 && diffDays <= 7;
        case 'month': return diffDays >= 0 && diffDays <= 30;
        default: return true;
    }
}

function renderEvents() {
    const filtered = filterEvents();
    const total = filtered.length;
    const totalPages = Math.ceil(total / itemsPerPage) || 1;
    
    if (currentPage > totalPages) currentPage = totalPages;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, total);
    const visibleEvents = filtered.slice(start, end);
    
    allEvents.forEach(card => card.classList.add('hidden'));
    visibleEvents.forEach(card => card.classList.remove('hidden'));
    
    resultCount.textContent = `${total} événement${total > 1 ? 's' : ''}`;
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationControls');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `<button class="page-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `<button class="page-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    paginationContainer.innerHTML = html;
    
    paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const page = btn.dataset.page;
            if (page === 'prev') {
                if (currentPage > 1) currentPage--;
            } else if (page === 'next') {
                const totalPages = Math.ceil(filterEvents().length / itemsPerPage);
                if (currentPage < totalPages) currentPage++;
            } else {
                currentPage = parseInt(page);
            }
            renderEvents();
            document.querySelector('.section-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
function getAllSearchTerms() {
    const terms = new Set();
    document.querySelectorAll('.event-card').forEach(card => {
        const title = card.querySelector('.card-body h3')?.textContent?.trim() || '';
        const category = card.dataset.category || '';
        const lieu = card.querySelector('.card-body p:last-child')?.textContent?.trim() || '';
        
        title.split(' ').forEach(word => {
            if (word.length > 2) terms.add(word.toLowerCase());
        });
        if (category) terms.add(category.toLowerCase());
        lieu.split(' ').forEach(word => {
            if (word.length > 2) terms.add(word.toLowerCase());
        });
    });
    return Array.from(terms);
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function showSuggestions(query) {
    if (!searchSuggestions) return;
    
    if (!query || query.length < 1) {
        searchSuggestions.classList.remove('show');
        return;
    }
    
    const allTerms = getAllSearchTerms();
    const queryLower = query.toLowerCase().trim();
    
    const matched = allTerms.filter(term => 
        term.includes(queryLower) && term !== queryLower
    );
    
    const eventTitles = [];
    document.querySelectorAll('.event-card').forEach(card => {
        const title = card.querySelector('.card-body h3')?.textContent?.trim() || '';
        if (title.toLowerCase().includes(queryLower) && 
            !matched.includes(title.toLowerCase()) &&
            title.toLowerCase() !== queryLower) {
            eventTitles.push(title);
        }
    });
    
    const results = [...matched, ...eventTitles].slice(0, 8);
    
    if (results.length === 0) {
        searchSuggestions.innerHTML = `<div class="suggestion-empty">Aucune suggestion</div>`;
        searchSuggestions.classList.add('show');
        return;
    }
    
    searchSuggestions.innerHTML = results.map(term => `
        <div class="suggestion-item" data-term="${term}">
            <i class="fas fa-search"></i>
            <span>${highlightMatch(term, query)}</span>
        </div>
    `).join('');
    
    searchSuggestions.classList.add('show');
    
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const term = item.dataset.term;
            searchInput.value = term;
            currentSearch = term;
            currentPage = 1;
            renderEvents();
            searchSuggestions.classList.remove('show');
            clearSearch.style.display = 'block';
        });
    });
}

// Rechèch
if (searchInput) {
    searchInput.addEventListener('input', function() {
        currentSearch = this.value;
        currentPage = 1;
        renderEvents();
        showSuggestions(this.value);
        clearSearch.style.display = this.value ? 'block' : 'none';
    });
    
    searchInput.addEventListener('blur', () => {
        setTimeout(() => searchSuggestions?.classList.remove('show'), 200);
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.length > 0) showSuggestions(this.value);
    });
}

if (clearSearch) {
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        currentPage = 1;
        renderEvents();
        clearSearch.style.display = 'none';
        searchSuggestions.classList.remove('show');
    });
}

filtreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filtreBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        currentPage = 1;
        renderEvents();
    });
});

filtreDateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filtreDateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDateFilter = btn.dataset.date;
        currentPage = 1;
        renderEvents();
    });
});

viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        viewBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');      
        const view = this.dataset.view;
        if (view === 'grid') {
            eventGrid.classList.remove('view-list');
            eventGrid.classList.add('view-grid');
        } else {
            eventGrid.classList.remove('view-grid');
            eventGrid.classList.add('view-list');
        }
    });
});

document.addEventListener('click', (e) => {
    if (searchSuggestions && !document.querySelector('.recherche')?.contains(e.target)) {
        searchSuggestions.classList.remove('show');
    }
});

document.querySelector('.filtre[data-filter="all"]')?.classList.add('active');
document.querySelectorAll('.filtre-date').forEach(b => b.classList.remove('active'));

allEvents = getAllEvents();
renderEvents();

// Menu toggle mobil
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

console.log('✅ evenements.js chaje — tout fonksyonalite aktive!');