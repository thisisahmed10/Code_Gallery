document.addEventListener('DOMContentLoaded', function() {
    const cardManager = new ProjectCardManager('feed-container');
    
    try {
        if (!feedData || feedData.length === 0) {
            cardManager.showEmptyState('No projects available');
            return;
        }
        
        const sortedProjects = cardManager.sortByDate(feedData);
        cardManager.initialize(sortedProjects);
        
    } catch (error) {
        console.error('Error initializing feed:', error);
        cardManager.showEmptyState('Error loading projects');
    }
});

window.goToDeveloperPage = function(developerName) {
    window.location.href = `developer.html?dev=${encodeURIComponent(developerName)}`;
};
