// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYaclxk-DpXHuTyAB3K9p0OI4Vwp4ymbE",
  authDomain: "agro-scan-8d67f.firebaseapp.com",
  projectId: "agro-scan-8d67f",
  storageBucket: "agro-scan-8d67f.firebasestorage.app",
  messagingSenderId: "879199658837",
  appId: "1:879199658837:web:4d260d6ddd7e75109585dc",
  measurementId: "G-QJ1X6J4CYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}