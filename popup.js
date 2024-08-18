function fetchArticleContent(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const title = doc.querySelector('h1')?.textContent || 'No Title Available';
            const author = doc.querySelector('[data-author-0]')?.getAttribute('data-author-0') || 'Unknown Author';
            const subject = doc.querySelector('div.print-entity-section-wrapper.F93gk a')?.textContent || 'No Subject';
            const time = doc.querySelector('time span')?.textContent || 'No Time';


            var paragraphs = Array.from(doc.querySelectorAll('p'))
                                    .map(p => p.innerHTML)
                                    .join('<br><br>');
            
                                    if (paragraphs === '') {
                                        paragraphs = `এই এক্সটেনশনে ভিডিও এবং ছবি রিপোর্ট উপলব্ধ নয়। লিঙ্ক থেকে সরাসরি পড়ুন।<a href="${url}" target="_blank">এখানে ক্লিক করুন|</a>`;
                                    }


            callback(title, paragraphs, author, subject, time);
        })
        .catch(error => {
            console.error('Error fetching article content:', error);
        });
}

function openArticlePopup(title, content, author, subject, time) {
    const newWindow = window.open('', '_blank', 'width=600,height=400px');
    
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link rel="stylesheet" href="content.css">
        </head>
        <body>
        <h1>${title}</h1>
        <div class="author">প্রতিবেদক: ${author} || বিষয়: ${subject} || ${time} || <button id="speakButton">শুনুন</button></div>
        <div id="content">${content}</div>
        <script src="responsivevoice.js?rvApiKey=Tt6q8V3c"></script>
        <script src="script.js"> </script>
        </body>
        </html>
    `);

    newWindow.document.close();
}

function fetchLatestArticle() {
    fetch('https://www.prothomalo.com/collection/latest')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const articleElement = doc.querySelector('.wide-story-card a');
            const articleTitle = articleElement?.getAttribute('aria-label');
            const articleUrl = articleElement?.getAttribute('href');
            
            if (articleTitle && articleUrl) {
                document.getElementById('article-title').textContent = articleTitle;
                const link = document.getElementById('article-link');
                link.href = articleUrl;

                link.addEventListener('click', (event) => {
                    event.preventDefault();

                    fetchArticleContent(articleUrl, (title, content, author, subject, time) => {
                        openArticlePopup(title, content, author, subject, time);
                    });
                });

            } else {
                document.getElementById('article-title').textContent = 'No article available';
                document.getElementById('article-link').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching latest article:', error);
        });
}

function speak() {
    console.log('Speaking...');
    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance("Welcome to this tutorial!");
  
    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice
  
    // Speak the text
    speechSynthesis.speak(utterance);
  }

fetchLatestArticle();
// speak();
