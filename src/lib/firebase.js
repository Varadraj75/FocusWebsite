import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Placeholder config - User needs to replace this
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "00000000000",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:00000000000:web:00000000000000"
};

// Initialize Firebase only if config is valid-ish (simple check)
// Otherwise we'll handle it in AuthContext
console.log("Firebase Config Check:", {
    apiKey: firebaseConfig.apiKey ? "Present" : "Missing",
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
