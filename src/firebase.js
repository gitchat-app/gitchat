import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
}

firebase.initializeApp(config); 

// export const askForPermission = async () => {
//   try {
//     const messaging = firebase.messaging();
//     await messaging.requestPermission();
//     const token = await messaging.getToken();
//     console.log("Have Permission");
//     console.log('token: ', token);
//     return token
//   } 
//   catch(err) {
//     console.log(err);
//   }
// };

// firebase.messaging().onMessage(payload => {
//   console.log('payload: ', payload);
//   console.log('testing...');
// })

export default firebase;
