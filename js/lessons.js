// ===== LESSONS PAGE JAVASCRIPT =====

let allLessons = [];
let currentPage = 1;
const lessonsPerPage = 9;

// DOM Elements
const lessonsGrid = document.getElementById('lessonsGrid');
const searchInput = document.getElementById('searchInput');
const bookFilter = document.getElementById('bookFilter');
const sortFilter = document.getElementById('sortFilter');
const resetBtn = document.getElementById('resetFilters');
const resultsCount = document.getElementById('resultsCount');
const pagination = document.getElementById('pagination');

// ===== FETCH LESSONS =====
async function fetchLessons() {
    try {
        const response = await fetch('/data/lessons.json');
        allLessons = await response.json();
        populateBookFilter();
        renderLessons();
    } catch (error) {
        console.error('Error fetching lessons:', error);
        lessonsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Lessons</h3>
                <p>There was a problem loading the lessons. Please try again later.</p>
            </div>
        `;
    }
}

// ===== POPULATE BOOK FILTER =====
function populateBookFilter() {
    const books = [...new Set(allLessons.map(lesson => lesson.book))].filter(Boolean).sort();
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookFilter.appendChild(option);
    });
}

// ===== FILTER AND SORT LESSONS =====
function getFilteredLessons() {
    let filtered = [...allLessons];

    // Search
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(lesson =>
            lesson.title.toLowerCase().includes(searchTerm) ||
            lesson.scripture.toLowerCase().includes(searchTerm) ||
            lesson.summary.toLowerCase().includes(searchTerm) ||
            lesson.topic.toLowerCase().includes(searchTerm)
        );
    }

    // Book filter
    const book = bookFilter.value;
    if (book !== 'all') {
        filtered = filtered.filter(lesson => lesson.book === book);
    }

    // Sort
    const sort = sortFilter.value;
    switch (sort) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }

    return filtered;
}

// ===== RENDER LESSONS =====
function renderLessons() {
    const filtered = getFilteredLessons();
    const totalPages = Math.ceil(filtered.length / lessonsPerPage);
    const startIndex = (currentPage - 1) * lessonsPerPage;
    const endIndex = startIndex + lessonsPerPage;
    const pageLessons = filtered.slice(startIndex, endIndex);

    // Update results count
    resultsCount.textContent = `${filtered.length} lesson${filtered.length !== 1 ? 's' : ''} found`;

    // Render lessons
    if (pageLessons.length === 0) {
        lessonsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Lessons Found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
        `;
    } else {
        lessonsGrid.innerHTML = pageLessons.map(lesson => `
            <div class="lesson-card" data-id="${lesson.id}">
                <div class="lesson-date">
                    <i class="fas fa-calendar-alt"></i> ${formatDate(lesson.date)}
                </div>
                ${lesson.topic ? `<span class="lesson-topic">${lesson.topic}</span>` : ''}
                <h3>${lesson.title}</h3>
                <div class="lesson-scripture">
                    <i class="fas fa-bible"></i> ${lesson.scripture}
                </div>
                <p class="lesson-summary">${lesson.summary}</p>
                <a href="lesson.html?id=${lesson.id}" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `).join('');
    }

    // Render pagination
    renderPagination(totalPages);
}

// ===== RENDER PAGINATION =====
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    html += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `
                <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (
            i === currentPage - 2 ||
            i === currentPage + 2
        ) {
            html += `<button disabled>…</button>`;
        }
    }

    // Next button
    html += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    pagination.innerHTML = html;
}

// ===== CHANGE PAGE =====
function changePage(page) {
    const filtered = getFilteredLessons();
    const totalPages = Math.ceil(filtered.length / lessonsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderLessons();

    // Scroll to top of lessons
    document.querySelector('.lessons-archive').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== EVENT LISTENERS =====
searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderLessons();
});

bookFilter.addEventListener('change', () => {
    currentPage = 1;
    renderLessons();
});

sortFilter.addEventListener('change', () => {
    currentPage = 1;
    renderLessons();
});

resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    bookFilter.value = 'all';
    sortFilter.value = 'newest';
    currentPage = 1;
    renderLessons();
});

// ===== KEYBOARD SHORTCUT: CMD+K or CTRL+K to focus search =====
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ===== INITIALIZE =====
fetchLessons();