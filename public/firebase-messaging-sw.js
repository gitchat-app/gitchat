// import firebase from "firebase";

// importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js');

// firebase.initializeApp({
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
// });

// const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler(payload => {
//   const title = payload.notification.title;
//   console.log('payload', payload.notification.icon);
//   const options = {
//     body: payload.notification.body,
//     icon: payload.notification.icon
//   }
//   return self.registration.showNotification(title, options);
// })