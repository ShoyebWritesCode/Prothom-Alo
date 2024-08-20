document.getElementById('printButton').addEventListener('click', () => { 
   const today = new Date();
   const options = { year: 'numeric', month: 'long', day: 'numeric' };
   const formattedDate = today.toLocaleDateString('bn-BD', options); 
   document.title = `মানবজমিন আজকের পত্রিকা - ${formattedDate}`;  
   window.print();
});
