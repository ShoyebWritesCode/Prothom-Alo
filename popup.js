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


            const paragraphs = Array.from(doc.querySelectorAll('p'))
                                    .map(p => p.innerHTML)
                                    .join('<br><br>');


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
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: black;
                }

                body::-webkit-scrollbar {
                    display: none;
                }
                
                h1 {
                    margin-top: 0;
                    color: red;
                    text-align: center;
                }

                #content {
                    text-align: left;
                    color: white;
                    font-size: 12px;
                }

                .author {
                    color: blue;
                    margin-bottom: 10px;
                    text-align: center;
                    font-size: 16px;
                }

                .read-aloud {
                    display: block;
                    margin: 20px auto;
                    padding: 10px 20px;
                    background-color: blue;
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
        <h1>${title}</h1>
        <div class="author">প্রতিবেদক: ${author} || বিষয়: ${subject} || ${time}</div>
        <div id="content">${content}</div>
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

fetchLatestArticle();
