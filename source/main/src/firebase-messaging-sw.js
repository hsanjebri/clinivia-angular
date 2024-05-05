/*importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging-compat.js");
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
var  firebase = {
  apiKey: "AIzaSyBt7YoUe8ybFNBMAEZ9_OZuval11vvwqas",
  authDomain: "web-notifaction.firebaseapp.com",
  projectId: "web-notifaction",
  storageBucket: "web-notifaction.appspot.com",
  messagingSenderId: "318501358336",
  appId: "1:318501358336:web:271e1a3b03aa678a2481e5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

 messaging = firebase.messaging();

// Add code to handle received messages here (optional)
 messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
})*/
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging-compat.js");

// Your web app's Firebase configuration
 firebaseConfig.initializeApp  ({
  apiKey: "AIzaSyBt7YoUe8ybFNBMAEZ9_OZuval11vvwqas",
  authDomain: "web-notifaction.firebaseapp.com",
  projectId: "web-notifaction",
  storageBucket: "web-notifaction.appspot.com",
  messagingSenderId: "318501358336",
  appId: "1:318501358336:web:271e1a3b03aa678a2481e5"
});

// Initialize Firebase

const  messaging = firebase.messaging();

