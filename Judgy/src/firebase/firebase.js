import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAKHsP-hosJq5-wA8uLzkf3XyRivRyixY8",
  authDomain: "judgy-a83f1.firebaseapp.com",
  databaseURL: "https://judgy-a83f1.firebaseio.com",
  projectId: "judgy-a83f1",
  storageBucket: "judgy-a83f1.appspot.com",
  messagingSenderId: "847608112032"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};