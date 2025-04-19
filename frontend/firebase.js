// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ94_hPrRLTYq0Iz90rykew7Tkih9NH9E",
  authDomain: "adam-ecccf.firebaseapp.com",
  projectId: "adam-ecccf",
  storageBucket: "adam-ecccf.firebasestorage.app",
  messagingSenderId: "394301555758",
  appId: "1:394301555758:web:dc67826d30f02b97288bbf",
  measurementId: "G-NYQMZGTJNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services conditionally
let analytics = null;
let auth = null;
let db = null;

// Initialize auth and firestore which work on server-side
if (typeof window !== 'undefined') {
  // Only import analytics on the client side
  const { getAnalytics } = require('firebase/analytics');
  analytics = getAnalytics(app);
}

// These services work in both server and client environments
auth = getAuth(app);
db = getFirestore(app);

// Export the Firebase instances for use in other files
export { app, analytics, auth, db };