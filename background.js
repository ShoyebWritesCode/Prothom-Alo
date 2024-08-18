// Background script to handle extension click and fetch latest article
chrome.action.onClicked.addListener((tab) => {
  fetch('https://www.prothomalo.com/collection/latest')
      .then(response => response.text())
      .then(html => {
          // Create a DOM parser to parse the HTML content
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Extract the latest article info
          const articleElement = doc.querySelector('.wide-story-card a');
          const articleTitle = articleElement?.getAttribute('aria-label');
          const articleUrl = articleElement?.getAttribute('href');
          
          if (articleTitle && articleUrl) {
              // Send the data to the popup
              chrome.storage.local.set({
                  latestArticle: {
                      title: articleTitle,
                      url: articleUrl
                  }
              });
          }
      })
      .catch(error => {
          console.error('Error fetching latest article:', error);
      });
});
