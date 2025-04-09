// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE6i3ALuOEWFhStEfizCvhVchO7kViuIY",
  authDomain: "granite-inventory-system.firebaseapp.com",
  projectId: "granite-inventory-system",
  storageBucket: "granite-inventory-system.firebasestorage.app",
  messagingSenderId: "157934687983",
  appId: "1:157934687983:web:86ad2e6283971c414bad1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);