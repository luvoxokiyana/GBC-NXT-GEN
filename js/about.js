// ===== ABOUT PAGE JAVASCRIPT =====

async function loadAbout() {
    try {
        const response = await fetch('/data/about.json');
        const data = await response.json();
        renderAbout(data);
    } catch (error) {
        console.error('Error loading about data:', error);
        document.getElementById('aboutContainer').innerHTML = `
            <div style="text-align: center; padding: 60px 0; color: var(--gray);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #e74c3c;"></i>
                <p style="margin-top: 12px;">Error loading content. Please try again later.</p>
            </div>
        `;
    }
}

function renderAbout(data) {
    const container = document.getElementById('aboutContainer');
    const loading = document.getElementById('aboutLoading');
    if (loading) loading.remove();

    let html = '';

    // ===== MISSION =====
    html += `
        <div class="about-mission">
            <div class="mission-icon"><i class="fas fa-church"></i></div>
            <h2>${data.mission.title}</h2>
            <p>${data.mission.description}</p>
        </div>
    `;

    // ===== CORE VALUES =====
    html += `
        <div class="about-values">
            <span class="section-label">What We Stand For</span>
            <h2>Our Core Values</h2>
            <p class="values-subtitle">These are the principles that shape everything we do as a community.</p>
            <div class="values-grid">
    `;

    data.values.forEach(value => {
        html += `
            <div class="value-card">
                <div class="value-icon"><i class="fas ${value.icon}"></i></div>
                <h3>${value.title}</h3>
                <p>${value.description}</p>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // ===== OUR STORY =====
    html += `
        <div class="about-story">
            <div class="story-wrapper">
                <div class="story-content">
                    <span class="section-label">Who We Are</span>
                    <h2>${data.story.title}</h2>
    `;

    data.story.paragraphs.forEach(p => {
        html += `<p>${p}</p>`;
    });

    html += `
                </div>
                <div class="story-image">
                    <i class="fas fa-users"></i>
                    <span>Building community, growing in faith</span>
                </div>
            </div>
        </div>
    `;

    // ===== LEADER (SINGLE PERSON) =====
    html += `
        <div class="about-leader">
            <span class="section-label">Our Leader</span>
            <h2>Meet Sasha</h2>
            <p class="leader-subtitle">The heart behind GBC NEXT GEN.</p>
            <div class="leader-card">
                <div class="leader-avatar"><i class="fas fa-user"></i></div>
                <h3>${data.leader.name}</h3>
                <span class="leader-role">${data.leader.role}</span>
                <p class="leader-bio">${data.leader.bio}</p>
            </div>
        </div>
    `;

    // ===== QUICK FACTS =====
    html += `
        <div class="about-facts">
            <span class="section-label">At a Glance</span>
            <h2>Quick Facts</h2>
            <div class="facts-grid">
    `;

    data.facts.forEach(fact => {
        html += `
            <div class="fact-card">
                <span class="fact-number">${fact.number}</span>
                <span class="fact-label">${fact.label}</span>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Load about data when page loads
document.addEventListener('DOMContentLoaded', loadAbout);