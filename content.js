// Function to extract the latest article information
function extractArticle() {
    const articleElement = document.querySelector('.wide-story-card a');
    const articleTitle = articleElement?.getAttribute('aria-label');
    const articleUrl = articleElement?.getAttribute('href');

    if (articleTitle && articleUrl) {
        // Store the article data in chrome.storage.local
        chrome.storage.local.set({ latestArticle: { title: articleTitle, url: articleUrl } }, () => {
            console.log('Article data stored:', { title: articleTitle, url: articleUrl });
        });
    }
}

// Run the extraction function
extractArticle();
