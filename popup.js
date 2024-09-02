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
    const newWindow = window.open('', '_blank', 'width=650px,height=400px');
    
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

fetchLatestArticle();

document.addEventListener("DOMContentLoaded", function() {
    const headers = document.querySelectorAll("#latest-news-heading, #today-paper-heading");
  
    headers.forEach(header => {
      header.addEventListener("click", function() {
        headers.forEach(h => h.classList.remove("active"));
        this.classList.add("active");
      });
    });
  });
  
document.getElementById('latest-news-heading').addEventListener('click', () => {
    const articleSection = document.getElementById('article');
    const todayPaperSection = document.getElementById('today-paper');
    
      articleSection.style.display = 'block';
      todayPaperSection.style.display = 'none';
 
  });
  
  document.getElementById('today-paper-heading').addEventListener('click', () => {
    const articleSection = document.getElementById('article');
    const todayPaperSection = document.getElementById('today-paper');

      todayPaperSection.style.display = 'block';
      articleSection.style.display = 'none';
  });
  
  const banglaWeekdays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  
  function getBanglaDate() {
    const today = new Date();
    const day = banglaWeekdays[today.getDay()];
    const date = today.getDate().toLocaleString('bn-BD');	
    const month = banglaMonths[today.getMonth()];
    const year = today.getFullYear().toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
    
    return `${day}, ${date} ${month}, ${year}`;
  }
  
  document.getElementById('bangla-date').textContent = getBanglaDate();

document.getElementById('fetchButton').addEventListener('click', () => {
    fetch('https://mzamin.com/printversion.php')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        
        const targetDiv = doc.querySelector('div.row.mb-5');
        
        if (targetDiv) {
            const imgElements = targetDiv.querySelectorAll('img');
            const imgSrcs = Array.from(imgElements).map(img => {
              let src = img.src;
              const prefix = 'chrome-extension://hepjgcfdncfnkgklncifhlmnhhlakmhi/';
              if (src.startsWith(prefix)) {
                src = src.replace(prefix, '');
              }
              src = src.replace('/thumb', ''); 
                src = 'https://mzamin.com/' + src;
              return src;
            });

          const newWindow = window.open('', '_blank', 'width=800,height=600');
          newWindow.document.write('<!DOCTYPE html><html><head> <title>মানবজমিন:আজকের পত্রিকা</title></head><body>');
          if (imgSrcs.length > 0) {
            const firstImg = imgSrcs.splice(22, 1)[0]; 
            imgSrcs.unshift(firstImg); 
          
            imgSrcs.forEach(src => {
              newWindow.document.write(`<img src="${src}" alt="Image" style="max-width: 100%; height: auto; border: 2px">`);
            });

             // Add a button to print the page
             newWindow.document.write(`
             <button id="printButton">প্রিন্ট</button>
             <script src="print.js"></script>
             `);

          }
          else {
            newWindow.document.write('<p>No images found in the specified div.</p>');
          }
          newWindow.document.write('</body></html>');
          newWindow.document.close();
        } else {
          console.error('No div with class "row mb-5" found.');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });


  