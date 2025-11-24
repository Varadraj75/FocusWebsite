import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    useEffect(() => {
        // Check if Firebase is configured properly
        const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "PLACEHOLDER";

        if (!isFirebaseConfigured) {
            console.log("Firebase not configured. Using LocalStorage fallback.");
            setIsOfflineMode(true);
            const storedUser = localStorage.getItem('offline_user');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password) => {
        if (isOfflineMode) {
            const user = { uid: 'offline-' + Date.now(), email, displayName: email.split('@')[0] };
            localStorage.setItem('offline_user', JSON.stringify(user));
            setCurrentUser(user);
            return user;
        }
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = async (email, password) => {
        if (isOfflineMode) {
            // Mock login - accept any credentials if they match stored (or just allow for demo)
            // For demo purposes, we'll just create a session if not exists or overwrite
            const user = { uid: 'offline-' + Date.now(), email, displayName: email.split('@')[0] };
            localStorage.setItem('offline_user', JSON.stringify(user));
            setCurrentUser(user);
            return user;
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        if (isOfflineMode) {
            localStorage.removeItem('offline_user');
            setCurrentUser(null);
            return;
        }
        return firebaseSignOut(auth);
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        isOfflineMode
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
