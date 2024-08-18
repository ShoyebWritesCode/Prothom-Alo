document.getElementById('speakButton').addEventListener('click', () => {    
    const content = document.getElementById('content').innerText;
    responsiveVoice.enableEstimationTimeout = false;
    responsiveVoice.speak(content, "Bangla Bangladesh Male");
   
});
