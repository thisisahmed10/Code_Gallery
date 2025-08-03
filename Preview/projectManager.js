class ProjectCardManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.projects = [];
    }

    initialize(projects) {
        this.projects = projects;
        this.renderProjects(this.projects);
        
        setTimeout(() => {
            this.initializeSliders();
        }, 100);
    }

    renderProjects(projects) {
        console.log('Rendering projects to container:', this.containerId, 'Projects:', projects);
        this.container.innerHTML = '';
        
        if (projects.length === 0) {
            this.showEmptyState('No projects available');
            return;
        }
        
        projects.forEach(project => {
            console.log('Creating card for project:', project.title);
            const card = this.createProjectCard(project);
            this.container.appendChild(card);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'feed-item';
        card.dataset.cardId = project.cardID;
        
        const images = project.prev || [];
        const sliderContent = images.length > 0 ? 
            this.createSliderHTML(images, project.cardID) : 
            '<div class="no-images">No preview available</div>';
        
        card.innerHTML = `
            <div class="feed-header">
                <img src="${project.PFP}" alt="${project.developer}" class="profile-pic">
                <div class="feed-info">
                    <h4 onclick="goToDeveloperPage('${project.developer}')">${project.developer}</h4>
                    <span class="date">${this.formatDate(project.date)}</span>
                </div>
            </div>
            <div class="preview-container">
                ${sliderContent}
            </div>
            <div class="feed-content">
                <h3 class="feed-title">${project.title}</h3>
                <p class="feed-description">${project.description}</p>
            </div>
            <div class="feed-footer">
                <div class="project-actions">
                    <a href="${project.viewProject}" class="view-btn" target="_blank" 
                       ${!project.viewProject ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                       View Project
                    </a>
                    <a href="${project.SourceCode}" class="source-btn" target="_blank"
                       ${!project.SourceCode ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                       Source Code
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    createSliderHTML(images, cardId) {
        if (images.length === 1) {
            return `
                <div class="image-slider" data-card-id="${cardId}">
                    <div class="slider-wrapper">
                        <div class="slide active">
                            <img src="${images[0]}" alt="Project preview" loading="lazy" draggable="false"
                                 onerror="console.error('Failed to load image:', '${images[0]}'); this.style.display='none';"
                                 onload="console.log('Image loaded successfully:', '${images[0]}');">
                        </div>
                    </div>
                </div>
            `;
        }
        
        const slidesHTML = images.map((img, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${img}" alt="Project preview ${index + 1}" loading="lazy" draggable="false" 
                     onerror="console.error('Failed to load image:', '${img}'); this.style.display='none';"
                     onload="console.log('Image loaded successfully:', '${img}');">
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

    initializeSliders() {
        const sliders = document.querySelectorAll('.image-slider');
        console.log('Initializing sliders, found:', sliders.length);
        
        sliders.forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            const dots = slider.querySelectorAll('.dot');
            const prevBtn = slider.querySelector('.slider-nav.prev');
            const nextBtn = slider.querySelector('.slider-nav.next');
            
            console.log('Slider has', slides.length, 'slides');
            
            if (slides.length <= 1) return;
            
            let currentSlide = 0;
            let slideInterval;
            let isHovered = false;
            
            function showSlide(index, direction = 'next') {
                console.log('Showing slide', index, 'direction:', direction);
                
                slides.forEach(slide => {
                    slide.classList.remove('active', 'prev');
                });
                
                const prevIndex = direction === 'next' 
                    ? (index - 1 + slides.length) % slides.length
                    : (index + 1) % slides.length;
                
                slides[prevIndex].classList.add('prev');
                
                slides[index].classList.add('active');
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                currentSlide = index;
            }
            
            function nextSlide() {
                const next = (currentSlide + 1) % slides.length;
                showSlide(next, 'next');
            }
            
            function prevSlide() {
                const prev = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(prev, 'prev');
            }
            
            function startSlideshow() {
                if (isHovered && slides.length > 1) {
                    slideInterval = setInterval(nextSlide, 2000);
                }
            }
            
            function stopSlideshow() {
                clearInterval(slideInterval);
            }
            
            slider.addEventListener('mouseenter', () => {
                isHovered = true;
                startSlideshow();
            });
            
            slider.addEventListener('mouseleave', () => {
                isHovered = false;
                stopSlideshow();
            });
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    prevSlide();
                    stopSlideshow();
                    setTimeout(startSlideshow, 1000);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    nextSlide();
                    stopSlideshow();
                    setTimeout(startSlideshow, 1000);
                });
            }
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const direction = index > currentSlide ? 'next' : 'prev';
                    showSlide(index, direction);
                    stopSlideshow();
                    setTimeout(startSlideshow, 1000);
                });
            });
            
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showEmptyState(message) {
        this.container.innerHTML = `
            <div class="empty-feed">
                <h3>No Projects Found</h3>
                <p>${message}</p>
            </div>
        `;
    }

    filterByDeveloper(developerName) {
        return this.projects.filter(project => 
            project.developer.toLowerCase() === developerName.toLowerCase()
        );
    }

    sortByDate(projects) {
        return [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

window.goToDeveloperPage = function(developerName) {
    window.location.href = `developer.html?dev=${encodeURIComponent(developerName)}`;
};
