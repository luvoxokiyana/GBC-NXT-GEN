// ===== EVENTS PAGE JAVASCRIPT =====

let allEvents = [];

// DOM Elements
const eventsContainer = document.getElementById('eventsContainer');
const eventTypeFilter = document.getElementById('eventTypeFilter');
const eventSort = document.getElementById('eventSort');
const resetBtn = document.getElementById('resetFilters');
const resultsCount = document.getElementById('resultsCount');

// ===== FETCH EVENTS =====
async function fetchEvents() {
    try {
        const response = await fetch('/data/events.json');
        const data = await response.json();
        allEvents = data.events;
        populateTypeFilter();
        renderEvents();
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('eventsLoading').innerHTML = `
            <div style="text-align: center; padding: 60px 0; color: var(--gray);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #e74c3c;"></i>
                <p style="margin-top: 12px;">Error loading events. Please try again later.</p>
            </div>
        `;
    }
}

// ===== POPULATE TYPE FILTER =====
function populateTypeFilter() {
    const types = [...new Set(allEvents.map(event => event.type))];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = formatTypeLabel(type);
        eventTypeFilter.appendChild(option);
    });
}

// ===== FORMAT TYPE LABEL =====
function formatTypeLabel(type) {
    const labels = {
        'bible-study': 'Bible Study',
        'community': 'Community',
        'social': 'Social',
        'special': 'Special',
        'church-visit': 'Church Visit'
    };
    return labels[type] || type;
}

// ===== FILTER AND SORT EVENTS =====
function getFilteredEvents() {
    let filtered = [...allEvents];

    // Type filter
    const type = eventTypeFilter.value;
    if (type !== 'all') {
        filtered = filtered.filter(event => event.type === type);
    }

    // Sort
    const sort = eventSort.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sort === 'upcoming') {
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const aIsUpcoming = dateA >= today;
            const bIsUpcoming = dateB >= today;
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;
            return dateA - dateB;
        });
    } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filtered;
}

// ===== RENDER EVENTS =====
function renderEvents() {
    const filtered = getFilteredEvents();
    const loading = document.getElementById('eventsLoading');

    resultsCount.textContent = `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`;

    if (filtered.length === 0) {
        if (loading) loading.remove();
        eventsContainer.innerHTML = `
            <div class="events-grid">
                <div class="no-results">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Events Found</h3>
                    <p>Try adjusting your filters to see more events.</p>
                </div>
            </div>
        `;
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '<div class="events-grid">';

    filtered.forEach(event => {
        const eventDate = new Date(event.date);
        const isPast = eventDate < today;
        const status = isPast ? 'past' : (event.status || 'upcoming');

        html += `
            <div class="event-card ${isPast ? 'past' : ''}">
                <div class="event-card-body">
                    <span class="event-status-badge ${status}">${status}</span>
                    <span class="event-type-tag ${event.type}">${formatTypeLabel(event.type)}</span>
                    <h3>${event.title}</h3>
                    <div class="event-date">
                        <i class="fas fa-calendar-alt"></i> ${formatDate(event.date)} ${event.time ? '· ' + event.time : ''}
                    </div>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                    </div>
                    <p class="event-description">${event.description}</p>
                    ${event.link ? `<a href="${event.link}" class="event-link">${event.linkText || 'Learn More'} <i class="fas fa-arrow-right"></i></a>` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';

    if (loading) loading.remove();
    eventsContainer.innerHTML = html;
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// ===== EVENT LISTENERS =====
eventTypeFilter.addEventListener('change', renderEvents);
eventSort.addEventListener('change', renderEvents);

resetBtn.addEventListener('click', () => {
    eventTypeFilter.value = 'all';
    eventSort.value = 'upcoming';
    renderEvents();
});

// ===== INITIALIZE =====
fetchEvents();