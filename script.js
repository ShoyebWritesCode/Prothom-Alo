document.getElementById('speakButton').addEventListener('click', () => {    
    const content = document.getElementById('content').innerText;
    responsiveVoice.speak(content, "Bangla Bangladesh Female");
   
});
