import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoadingAuth(false); });
        return () => unsub();
    }, []);

    const register = async (email, password) => { await createUserWithEmailAndPassword(auth, email, password); toast.success("Account created!"); };
    const login = async (email, password) => { await signInWithEmailAndPassword(auth, email, password); toast.success("Logged in"); };
    const loginWithGoogle = async () => { await signInWithPopup(auth, new GoogleAuthProvider()); toast.success("Logged in with Google"); };
    const logout = async () => { await signOut(auth); toast.success("Logged out"); };

    return <AuthContext.Provider value={{ user, loadingAuth, register, login, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}
