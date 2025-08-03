document.addEventListener('DOMContentLoaded', function() {
    const feedContainer = document.getElementById('feed-container');
    
    // Initialize feed
    initializeFeed();
    
    function initializeFeed() {
        try {
            if (!feedData || feedData.length === 0) {
                showEmptyFeed();
                return;
            }
            
            const sortedProjects = sortProjectsByDate(feedData);
            renderProjects(sortedProjects);
            
            setTimeout(() => {
                initializeSliders();
                setupDeveloperClickHandlers();
            }, 100);
            
        } catch (error) {
            console.error('Error initializing feed:', error);
            showEmptyFeed('Error loading projects');
        }
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
                    <h4><a href="#" class="developer-name" data-developer="${project.developer}">${project.developer}</a></h4>
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
    
    function setupDeveloperClickHandlers() {
        document.querySelectorAll('.developer-name').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const developerName = this.dataset.developer;
                window.location.href = `developer.html?dev=${encodeURIComponent(developerName)}`;
            });
        });
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
    
    function showEmptyFeed(message = 'No projects available') {
        feedContainer.innerHTML = `
            <div class="empty-feed">
                <h3>No Projects Found</h3>
                <p>${message}</p>
            </div>
        `;
    }
});