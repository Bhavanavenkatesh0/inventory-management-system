import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBE6i3ALuOEWFhStEfizCvhVchO7kViuIY",
  authDomain: "granite-inventory-system.firebaseapp.com",
  databaseURL: "https://granite-inventory-system-default-rtdb.firebaseio.com",
  projectId: "granite-inventory-system",
  storageBucket: "granite-inventory-system.firebasestorage.app",
  messagingSenderId: "157934687983",
  appId: "1:157934687983:web:86ad2e6283971c414bad1a"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);