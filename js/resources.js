// ===== RESOURCES PAGE JAVASCRIPT =====

async function loadResources() {
    try {
        const response = await fetch('/data/resources.json');
        const data = await response.json();
        renderResources(data);
    } catch (error) {
        console.error('Error loading resources:', error);
        document.getElementById('resourcesContainer').innerHTML = `
            <div style="text-align: center; padding: 60px 0; color: var(--gray);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--red, #e74c3c);"></i>
                <p style="margin-top: 12px;">Error loading resources. Please try again later.</p>
            </div>
        `;
    }
}

function renderResources(data) {
    const container = document.getElementById('resourcesContainer');
    const loading = document.getElementById('resourcesLoading');
    
    if (loading) loading.remove();

    let html = '';

    data.categories.forEach(category => {
        const highlightClass = category.highlight ? ' highlight' : '';
        
        html += `
            <div class="resource-category${highlightClass}" id="${category.id}">
                <div class="category-header">
                    <h2><i class="fas ${category.icon}"></i> ${category.title}</h2>
                    <p>${category.description}</p>
                </div>
                <div class="resource-cards${category.highlight ? ' highlight-cards' : ''}">
        `;

        category.resources.forEach(resource => {
            const typeIcon = getTypeIcon(resource.type);
            const typeClass = resource.type;
            
            html += `
                <div class="resource-card${category.highlight ? ' highlight-card' : ''}">
                    <div class="resource-type ${typeClass}"><i class="${typeIcon}"></i> ${capitalize(resource.type)}</div>
                    <h3>${resource.title}</h3>
                    ${resource.author ? `<p class="resource-author">by ${resource.author}</p>` : ''}
                    <p class="resource-description">${resource.description}</p>
                    <a href="${resource.link}" target="${resource.link.startsWith('http') ? '_blank' : '_self'}" class="resource-link">
                        ${resource.linkText} <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function getTypeIcon(type) {
    const icons = {
        'book': 'fas fa-book',
        'website': 'fas fa-globe',
        'podcast': 'fas fa-podcast',
        'app': 'fas fa-mobile-alt',
        'series': 'fas fa-video'
    };
    return icons[type] || 'fas fa-link';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load resources when page loads
document.addEventListener('DOMContentLoaded', loadResources);