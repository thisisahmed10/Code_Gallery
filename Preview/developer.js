document.addEventListener('DOMContentLoaded', function() {
    const cardManager = new ProjectCardManager('developer-feed-container');
    
    const developerHeaderNameEl = document.getElementById('developer-header-name');
    const developerHeaderPicEl = document.getElementById('developer-header-pic');
    const developerHeaderCountEl = document.getElementById('developer-header-count');
    const pageTitle = document.getElementById('page-title');
    
    const urlParams = new URLSearchParams(window.location.search);
    const developerName = urlParams.get('dev');
    
    if (!developerName) {
        showError('No developer specified');
        return;
    }
    
    initializeDeveloperPage(developerName);
    
    function initializeDeveloperPage(developer) {
        try {
            if (!feedData || feedData.length === 0) {
                showError('No project data available');
                return;
            }
            
            const developerProjects = feedData.filter(project => 
                project.developer === developer
            );
            
            if (developerProjects.length === 0) {
                cardManager.showEmptyState(`No projects found for ${developer}`);
                updatePageTitle(developer, 0);
                updateHeaderInfo(developer, 0);
                return;
            }
            
            const sortedProjects = cardManager.sortByDate(developerProjects);
            cardManager.initialize(sortedProjects);
            
            updatePageTitle(developer, sortedProjects.length);
            updateHeaderInfo(developer, sortedProjects.length, sortedProjects[0]);
            
        } catch (error) {
            console.error('Error loading developer projects:', error);
            showError('Error loading developer projects');
        }
    }
    
    function updatePageTitle(developer, projectCount) {
        pageTitle.textContent = `${developer} - ${projectCount} Project${projectCount !== 1 ? 's' : ''}`;
    }
    
    function updateHeaderInfo(developer, projectCount, firstProject = null) {
        if (developerHeaderNameEl) {
            developerHeaderNameEl.textContent = developer;
        }
        
        if (developerHeaderCountEl) {
            developerHeaderCountEl.textContent = projectCount;
        }
        
        if (developerHeaderPicEl && firstProject) {
            developerHeaderPicEl.src = firstProject.PFP;
            developerHeaderPicEl.alt = developer;
        }
    }
    
    function showError(message) {
        const feedContainer = document.getElementById('developer-feed-container');
        if (feedContainer) {
            feedContainer.innerHTML = `
                <div class="error-message">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <a href="feed.html" class="back-link">← Back to Feed</a>
                </div>
            `;
        }
    }
});
