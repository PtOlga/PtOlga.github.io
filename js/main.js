// Data fetching and dynamic rendering logic
const DATA_URLS = {
    en: 'data/translations/en.json',
    sv: 'data/translations/sv.json',
    projects_en: 'data/projects.json',
    projects_sv: 'data/projects_sv.json',
    skills: 'data/skills.json',
    experience_en: 'data/experience.json',
    experience_sv: 'data/experience_sv.json'
};

const CACHE = {};

async function fetchData(url) {
    if (CACHE[url]) {
        return CACHE[url];
    }
    const response = await fetch(url);
    const data = await response.json();
    CACHE[url] = data;
    return data;
}

// Language switcher
async function setLanguage(lang) {
    const translations = await fetchData(DATA_URLS[lang]);
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = key.split('.').reduce((obj, k) => obj[k], translations);
        if (value) {
            element.innerHTML = value;
        }
    });

    // Update button active state
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Re-render dynamic sections with new translations
    renderSkills();
    renderExperience();
    renderProjects();
    renderResume();
}

// Render dynamic sections
async function renderStats() {
    const translations = await fetchData(DATA_URLS[document.querySelector('.language-btn.active').getAttribute('data-lang')]);
    const statsData = [
        {number: '15+', label: translations.about.stats_years},
        {number: '50+', label: translations.about.stats_projects},
        {number: '26', label: translations.about.stats_stores},
        {number: '3', label: translations.about.stats_languages}
    ];

    const container = document.getElementById('stats-grid-container');
    container.innerHTML = statsData.map(stat => `
        <div class="stat-item">
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

async function renderSkills() {
    const skillsData = await fetchData(DATA_URLS.skills);
    const container = document.getElementById('skills-grid-container');
    const translations = await fetchData(DATA_URLS[document.querySelector('.language-btn.active').getAttribute('data-lang')]);

    container.innerHTML = skillsData.map(category => `
        <div class="skill-category">
            <h3><i class="${category.icon}"></i> ${category.title}</h3>
            <div class="skill-tags">
                ${category.items.map(skill => `<span class="skill-tag ${skill.level}">${skill.name}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

async function renderProjects() {
    const currentLang = document.querySelector('.language-btn.active').getAttribute('data-lang');
    const projectsUrl = currentLang === 'sv' ? DATA_URLS.projects_sv : DATA_URLS.projects_en;
    const projectsData = await fetchData(projectsUrl);
    const container = document.getElementById('projects-grid-container');
    const translations = await fetchData(DATA_URLS[currentLang]);

    container.innerHTML = projectsData.map(project => {
        const categoryLabels = {
            'ai': (translations.projects && translations.projects.filter_ai) || 'AI & Automation',
            'erp': (translations.projects && translations.projects.filter_erp) || 'ERP/CRM', 
            'web': (translations.projects && translations.projects.filter_web) || 'Web Development'
        };

        // Handle single category or array of categories
        const categories = Array.isArray(project.category) ? project.category : [project.category];
        const categoryString = categories.join(' ');
        const displayCategory = categoryLabels[categories[0]] || categories[0];

        return `
            <div class="project-card" data-category="${categoryString}">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="${project.icon}"></i>
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <span class="project-category">${displayCategory}</span>
                    </div>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <div class="project-features">
                    ${project.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <div class="project-links">
                    ${project.links.demo ? `
                        <a href="${project.links.demo}" class="project-link primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            ${(translations.projects && translations.projects.live_demo) || 'Live Demo'}
                        </a>
                    ` : ''}
                    ${project.links.github ? `
                        <a href="${project.links.github}" class="project-link secondary" target="_blank">
                            <i class="fab fa-github"></i>
                            ${(translations.projects && translations.projects.source_code) || 'Source Code'}
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Initialize project filtering
    initProjectFiltering();
}

function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');
                if (category === 'all' || cardCategories.includes(category)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

async function renderExperience() {
    const currentLang = document.querySelector('.language-btn.active').getAttribute('data-lang');
    const experienceUrl = currentLang === 'sv' ? DATA_URLS.experience_sv : DATA_URLS.experience_en;
    const experienceData = await fetchData(experienceUrl);
    const container = document.getElementById('experience-timeline-container');
    
    container.innerHTML = experienceData.map(item => `
        <div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-date">${item.date}</div>
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
                <ul>
                    ${item.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

async function renderResume() {
    const currentLang = document.querySelector('.language-btn.active').getAttribute('data-lang');
    const translations = await fetchData(DATA_URLS[currentLang]);
    const experienceUrl = currentLang === 'sv' ? DATA_URLS.experience_sv : DATA_URLS.experience_en;
    const experienceData = await fetchData(experienceUrl);

    const experienceHtml = experienceData.map(item => `
        <div class="job">
            <div class="job-header">
                <div class="job-title">
                    <h4>${item.title}</h4>
                    <p class="company">${item.company}</p>
                </div>
                <div class="job-date">${item.date}</div>
            </div>
            <ul>
                ${item.responsibilities.slice(0, 3).map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    const resumeHtml = `
        <div class="resume-header">
            <div class="resume-info">
                <h1>Olga Saether</h1>
                <h2>Python AI Developer & ERP/CRM Consultant</h2>
                <div class="resume-contact">
                    <span><i class="fas fa-phone"></i> +46 737 686 471</span>
                    <span><i class="fas fa-envelope"></i> 5441700@gmail.com</span>
                    <span><i class="fas fa-map-marker-alt"></i> Charlottenberg, Sweden</span>
                    <span><i class="fab fa-linkedin"></i> linkedin.com/in/olga-petrovskaya</span>
                    <span><i class="fab fa-github"></i> github.com/PtOlga</span>
                </div>
            </div>
        </div>

        <div class="resume-section">
            <h3>${translations.resume.summary_title}</h3>
            <p>${translations.resume.summary_text}</p>
        </div>

        <div class="resume-skills">
            <div class="skill-group">
                <h4>${translations.resume.skills_ai}</h4>
                <p>${translations.resume.skills_ai_list}</p>
            </div>
            <div class="skill-group">
                <h4>${translations.resume.skills_db}</h4>
                <p>${translations.resume.skills_db_list}</p>
            </div>
            <div class="skill-group">
                <h4>${translations.resume.skills_erp}</h4>
                <p>${translations.resume.skills_erp_list}</p>
            </div>
            <div class="skill-group">
                <h4>${translations.resume.skills_web}</h4>
                <p>${translations.resume.skills_web_list}</p>
            </div>
        </div>

        <div class="resume-section">
            <h3>${translations.resume.experience_title}</h3>
            ${experienceHtml}
        </div>

        <div class="resume-section">
            <h3>${translations.resume.education_title}</h3>
            <div class="education-item">
                <strong>${translations.resume.edu_cert_1_name}</strong> - ${translations.resume.edu_cert_1_desc}
            </div>
            <div class="education-item">
                <strong>${translations.resume.edu_degree_name}</strong> - ${translations.resume.edu_degree_desc}
            </div>
            <div class="education-item">
                <strong>${translations.resume.edu_cert_title}:</strong> ${translations.resume.edu_cert_list}
            </div>
        </div>

        <div class="resume-section">
            <h3>${translations.resume.projects_title}</h3>
            <ul>
                <li><strong>${translations.resume.project_1_name}:</strong> ${translations.resume.project_1_desc}</li>
                <li><strong>${translations.resume.project_2_name}:</strong> ${translations.resume.project_2_desc}</li>
                <li><strong>${translations.resume.project_3_name}:</strong> ${translations.resume.project_3_desc}</li>
                <li><strong>${translations.resume.project_4_name}:</strong> ${translations.resume.project_4_desc}</li>
                <li><strong>${translations.resume.project_5_name}:</strong> ${translations.resume.project_5_desc}</li>
                <li><strong>${translations.resume.project_6_name}:</strong> ${translations.resume.project_6_desc}</li>
            </ul>
        </div>

        <div class="resume-section">
            <h3>${translations.resume.languages_title}</h3>
            <div class="languages">
                <span><strong>${translations.resume.lang_ru}:</strong> ${translations.resume.lang_ru_level}</span>
                <span><strong>${translations.resume.lang_en}:</strong> ${translations.resume.lang_en_level}</span>
                <span><strong>${translations.resume.lang_sv}:</strong> ${translations.resume.lang_sv_level}</span>
            </div>
        </div>
    `;

    document.getElementById('resume-container').innerHTML = resumeHtml;
}


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial data load for English
    setLanguage('en');
    
    // Initialize projects section
    renderProjects();

    // Language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
