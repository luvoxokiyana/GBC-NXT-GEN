// ===== CONTACT PAGE JAVASCRIPT =====

async function loadContact() {
    try {
        const response = await fetch('/data/contact.json');
        const data = await response.json();
        renderContact(data);
    } catch (error) {
        console.error('Error loading contact data:', error);
        document.getElementById('contactContainer').innerHTML = `
            <div style="text-align: center; padding: 60px 0; color: var(--gray);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #e74c3c;"></i>
                <p style="margin-top: 12px;">Error loading content. Please try again later.</p>
            </div>
        `;
    }
}

function renderContact(data) {
    const container = document.getElementById('contactContainer');
    const loading = document.getElementById('contactLoading');
    if (loading) loading.remove();

    let html = `
        <div class="contact-wrapper">
            <!-- Contact Info -->
            <div class="contact-info">
                <h2>${data.info.title}</h2>
                <p class="contact-subtitle">${data.info.description}</p>
    `;

    data.info.items.forEach(item => {
        const link = item.link ? `href="${item.link}"` : '';
        const target = item.link && item.link.startsWith('http') ? 'target="_blank"' : '';
        html += `
            <div class="contact-item">
                <div class="contact-icon"><i class="${item.icon}"></i></div>
                <div class="contact-text">
                    <span class="contact-label">${item.label}</span>
                    <span class="contact-value">
                        ${link ? `<a ${link} ${target}>${item.value}</a>` : item.value}
                    </span>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <!-- Contact Form -->
            <div class="contact-form-wrapper">
                <h2>${data.form.title}</h2>
                <p class="form-subtitle">${data.form.subtitle}</p>
                <form id="contactForm" action="${data.form.formspreeEndpoint}" method="POST">
    `;

    data.form.fields.forEach(field => {
        const required = field.required ? '<span class="required">*</span>' : '';
        const requiredAttr = field.required ? 'required' : '';

        html += `<div class="form-group">`;
        html += `<label for="${field.id}">${field.label} ${required}</label>`;

        if (field.type === 'select') {
            html += `<select id="${field.id}" name="${field.id}" ${requiredAttr}>`;
            html += `<option value="">Select an option...</option>`;
            field.options.forEach(option => {
                html += `<option value="${option}">${option}</option>`;
            });
            html += `</select>`;
        } else if (field.type === 'textarea') {
            html += `<textarea id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${requiredAttr}></textarea>`;
        } else {
            html += `<input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${requiredAttr} />`;
        }

        html += `</div>`;
    });

    // Add hidden field to prevent spam
    html += `
                    <input type="hidden" name="_subject" value="New Contact Form Submission" />
                    <input type="hidden" name="_captcha" value="false" />
                    <div class="form-submit">
                        <button type="submit" class="btn-primary" id="formSubmitBtn">
                            <i class="fas fa-paper-plane"></i> ${data.form.submitText}
                        </button>
                    </div>
                </form>
                <div class="form-success" id="formSuccess">
                    <i class="fas fa-check-circle"></i>
                    <h3>${data.form.successMessage.title}</h3>
                    <p>${data.form.successMessage.description}</p>
                </div>
                <div class="form-error" id="formError" style="display: none; text-align: center; padding: 40px 20px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 12px;"></i>
                    <h3 style="color: var(--white); font-size: 1.3rem; margin-bottom: 8px;">${data.form.errorMessage.title}</h3>
                    <p style="color: var(--gray); font-size: 1rem;">${data.form.errorMessage.description}</p>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // ===== FORM HANDLING =====
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    form.style.display = 'none';
                    success.style.display = 'block';
                    error.style.display = 'none';
                    console.log('Form submitted successfully!');
                } else {
                    // Error
                    form.style.display = 'none';
                    success.style.display = 'none';
                    error.style.display = 'block';
                    console.error('Form submission error:', response.status);
                }
            } catch (error) {
                // Network error
                form.style.display = 'none';
                success.style.display = 'none';
                error.style.display = 'block';
                console.error('Network error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        });
    }
}

// Load contact data when page loads
document.addEventListener('DOMContentLoaded', loadContact);