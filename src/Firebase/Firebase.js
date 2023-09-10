// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdYVEZEBkDRm240spjdgBW12CyW5S1yuE",
  authDomain: "fir-realtor-clone-react.firebaseapp.com",
  projectId: "fir-realtor-clone-react",
  storageBucket: "fir-realtor-clone-react.appspot.com",
  messagingSenderId: "647495518209",
  appId: "1:647495518209:web:4f211a6ce25eb2a0355800",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
