// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain:
//     import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
//     process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId:
//     import.meta.env.VITE_FIREBASE_PROJECT_ID ||
//     process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID,
//   messagingSenderId:
//     import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
//     process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyCARraQaOJNCZ8uEM9cR1HYnegVaOV8KU4",
  authDomain: "petsupplies-dd454.firebaseapp.com",
  projectId: "petsupplies-dd454",
  storageBucket: "petsupplies-dd454.firebasestorage.app",
  messagingSenderId: "188646016371",
  appId: "1:188646016371:web:cd3351393b6410c3993106",
  measurementId: "G-1PQW5R921T",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Optional: always show account chooser
googleProvider.setCustomParameters({ prompt: "select_account" });
