import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Provider component
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    // Auth actions
    const register = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Account created successfully!");
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful!");
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast.success("Logged in with Google!");
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        user,
        loadingAuth,
        register,
        login,
        loginWithGoogle,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
