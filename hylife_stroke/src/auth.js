// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAViuHHUuFJsCFImTwwLSD-Otc0jGEI_3A",
  authDomain: "hylifestroke.firebaseapp.com",
  projectId: "hylifestroke",
  storageBucket: "hylifestroke.firebasestorage.app",
  messagingSenderId: "231535259233",
  appId: "1:231535259233:web:b0a957928be05cb6540420",
  measurementId: "G-L1R52VXY8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);