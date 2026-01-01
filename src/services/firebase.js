import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBtr5X2vwnQNdXHXSpDB7ChHFPm7651b4o",
    authDomain: "manguezal-curso.firebaseapp.com",
    projectId: "manguezal-curso",
    storageBucket: "manguezal-curso.firebasestorage.app",
    messagingSenderId: "208611161796",
    appId: "1:208611161796:web:5145f7a5d8eef5c98b7b91",
    measurementId: "G-1GF001Q7XG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
// Using initializeFirestore to ensure we can configure experimental settings if needed later
// But getting default instance for now
export const db = getFirestore(app);

export default app;
