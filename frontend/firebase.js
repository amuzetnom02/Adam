// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firebase instances for use in other files
export { app, analytics, auth, db };