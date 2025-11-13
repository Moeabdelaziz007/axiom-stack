// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoEIcH5b1pqFBZERonqBt8_a5K7cFV-Yo",
  authDomain: "asiom-id.firebaseapp.com",
  projectId: "asiom-id",
  storageBucket: "asiom-id.firebasestorage.app",
  messagingSenderId: "854639150351",
  appId: "1:854639150351:web:4761b9e64518ff50542a7a",
  measurementId: "G-E9GZKKC8RJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };