importScripts('https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js');

// importScripts('https://www.gstatic.com/firebasejs/7.2.3/firebase-analytics.js');
importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js");


 // Initialize Firebase
 firebase.initializeApp({
    'messagingSenderId': '103953800507'
  });
  
  const messaging = firebase.messaging();
