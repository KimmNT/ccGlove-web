// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3ijvkBee8BsVwrtm6ruT54YtfLUMeH9c",
  authDomain: "ccgloves-d7ea8.firebaseapp.com",
  projectId: "ccgloves-d7ea8",
  storageBucket: "ccgloves-d7ea8.appspot.com",
  messagingSenderId: "528182716350",
  appId: "1:528182716350:web:c6c79d51b5454c3135fbef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
