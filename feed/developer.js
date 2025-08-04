document.addEventListener('DOMContentLoaded', function() {
    const feedContainer = document.getElementById('developer-feed-container');
    const developerNameEl = document.getElementById('developer-name');
    const developerPicEl = document.getElementById('developer-pic');
    const projectCountEl = document.getElementById('project-count');
    const pageTitle = document.getElementById('page-title');
    
    const urlParams = new URLSearchParams(window.location.search);
    const developerName = urlParams.get('dev');
    
    if (!developerName) {
        showError('No developer specified');
        return;
    }
    
    initializeDeveloperPage(developerName);
    
    function initializeDeveloperPage(developerName) {
        try {
            if (!feedData || feedData.length === 0) {
                showError('No project data available');
                return;
            }
            
            const developerProjects = filterProjectsByDeveloper(feedData, developerName);
            
            if (developerProjects.length === 0) {
                showError('No projects found for this developer');
                return;
            }
            
            updateDeveloperInfo(developerProjects[0], developerProjects.length);
            const sortedProjects = sortProjectsByDate(developerProjects);
            
            renderProjects(sortedProjects);
            
            setTimeout(() => {
                initializeSliders();
            }, 100);
            
        } catch (error) {
            console.error('Error initializing developer page:', error);
            showError('Error loading developer projects');
        }
    }
    
    function updateDeveloperInfo(project, projectCount) {
        developerNameEl.textContent = project.developer;
        developerPicEl.src = project.PFP;
        developerPicEl.alt = project.developer;
        projectCountEl.textContent = `Projects: ${projectCount}`;
        pageTitle.textContent = `${project.developer} - Developer Profile`;
    }
    
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'feed-item';
        card.dataset.cardId = project.cardID;
        
        const images = project.prev || [];
        const sliderContent = images.length > 0 ? 
            createSliderHTML(images, project.cardID) : 
            '<div class="no-images">No preview available</div>';
        
        card.innerHTML = `
            <div class="feed-header">
                <img src="${project.PFP}" alt="${project.developer}" class="profile-pic">
                <div class="feed-info">
                    <h4>${project.developer}</h4>
                    <span class="date">${formatDate(project.date)}</span>
                </div>
            </div>
            <div class="feed-content">
                <h3 class="feed-title">${project.title}</h3>
                <p class="feed-description">${project.description}</p>
            </div>
            <div class="preview-container">
                ${sliderContent}
            </div>
            <div class="feed-footer">
                <div class="project-actions">
                    <a href="${project.viewProject}" class="view-btn" target="_blank">View Project</a>
                    <a href="${project.SourceCode}" class="source-btn" target="_blank">Source Code</a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function createSliderHTML(images, cardId) {
        if (images.length === 1) {
            return `
                <div class="image-slider" data-card-id="${cardId}">
                    <div class="slider-wrapper">
                        <div class="slide active">
                            <img src="${images[0]}" alt="Project preview" loading="lazy">
                        </div>
                    </div>
                </div>
            `;
        }
        
        const slidesHTML = images.map((img, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${img}" alt="Project preview ${index + 1}" loading="lazy">
            </div>
        `).join('');
        
        const dotsHTML = images.map((_, index) => `
            <span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
        `).join('');
        
        return `
            <div class="image-slider" data-card-id="${cardId}">
                <div class="slider-wrapper">
                    ${slidesHTML}
                </div>
                <button class="slider-nav prev" data-direction="prev">‹</button>
                <button class="slider-nav next" data-direction="next">›</button>
                <div class="slider-dots">
                    ${dotsHTML}
                </div>
            </div>
        `;
    }
    
    function initializeSliders() {
        const sliders = document.querySelectorAll('.image-slider');
        
        sliders.forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            const dots = slider.querySelectorAll('.dot');
            const prevBtn = slider.querySelector('.slider-nav.prev');
            const nextBtn = slider.querySelector('.slider-nav.next');
            
            if (slides.length <= 1) return;
            
            let currentSlide = 0;
            let slideInterval;
            let isHovered = false;
            
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                currentSlide = index;
            }
            
            function nextSlide() {
                const next = (currentSlide + 1) % slides.length;
                showSlide(next);
            }
            
            function prevSlide() {
                const prev = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(prev);
            }
            
            function startSlideshow() {
                if (!isHovered) {
                    slideInterval = setInterval(nextSlide, 2000);
                }
            }
            
            function stopSlideshow() {
                clearInterval(slideInterval);
            }
            
            // Event listeners
            slider.addEventListener('mouseenter', () => {
                isHovered = true;
                stopSlideshow();
            });
            
            slider.addEventListener('mouseleave', () => {
                isHovered = false;
                startSlideshow();
            });
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    prevSlide();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    nextSlide();
                });
            }
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(index);
                });
            });
            
            slider.addEventListener('mouseenter', startSlideshow);
        });
    }
    
    function filterProjectsByDeveloper(projects, developerName) {
        return projects.filter(project => 
            project.developer.toLowerCase() === developerName.toLowerCase()
        );
    }
    
    function sortProjectsByDate(projects) {
        return [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    function renderProjects(projects) {
        feedContainer.innerHTML = '';
        
        projects.forEach(project => {
            const card = createProjectCard(project);
            feedContainer.appendChild(card);
        });
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function showError(message) {
        feedContainer.innerHTML = `
            <div class="empty-feed">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
        developerNameEl.textContent = 'Error';
        projectCountEl.textContent = 'Projects: 0';
    }
});