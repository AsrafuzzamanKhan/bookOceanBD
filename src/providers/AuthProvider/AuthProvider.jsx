import { createContext, useEffect, useState } from "react";
import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signInWithPopup, signOut, updatePassword, updateProfile } from "firebase/auth";
import { app } from "../../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null)

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true)
    // google login 
    const googleProvider = new GoogleAuthProvider();

    const googleSignIn = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }
    // create user 
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    // sign in 
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    // logout
    const logOut = () => {
        setLoading(true)
        return signOut(auth)
    }
    // Sends a branded password reset email via our own server (mailer.js /
    // Gmail SMTP) instead of Firebase's default one, which arrives from a
    // generic firebaseapp.com address with no branding and gets flagged as
    // spam. The server still uses Firebase Admin to generate the actual
    // reset link/token - we just own the email itself.
    const resetPassword = (email) => {
        return axios.post('https://book-ocean-bd-server.vercel.app/auth/forgot-password', { email })
    }
    // Same reasoning as resetPassword: a branded email via our own server/
    // mailer instead of Firebase's generic default. Used right after signup,
    // and again from the "resend" button on the verify-email banner.
    const sendVerificationEmail = (email) => {
        return axios.post('https://book-ocean-bd-server.vercel.app/auth/send-verification-email', { email })
    }
    // changing a password requires a "recent" login - re-authenticate with
    // their current password first so this doesn't randomly fail with
    // auth/requires-recent-login on an older session, and so nobody can
    // change the password on an account they don't actually have the
    // password for even if the browser session is still logged in.
    const changePassword = async (currentPassword, newPassword) => {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
        return updatePassword(auth.currentUser, newPassword)
    }

    // user subscribe 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            // console.log('current user', currentUser)

            // get and set token 
            if (currentUser) {
                axios.post('https://book-ocean-bd-server.vercel.app/jwt', { email: currentUser.email })
                    .then(data => {
                        // console.log(data.data.token)
                        localStorage.setItem('access-token', data.data.token)
                        setLoading(false)
                    })
            }
            else {
                localStorage.removeItem('access-token')
            }

        });
        return () => {
            return unsubscribe()
        }
    }, [])

    // user profile update
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        })
    }
    // re-syncs local `user` state after updateUserProfile() - Firebase updates
    // auth.currentUser in place but that doesn't by itself trigger a re-render,
    // since onAuthStateChanged only fires on sign-in/out, not on profile edits.
    const refreshUser = async () => {
        await auth.currentUser.reload()
        const refreshed = { ...auth.currentUser }
        setUser(refreshed)
        return refreshed
    }
    // value
    const authInfo = {
        googleSignIn,
        user,
        loading,
        setLoading,
        createUser,
        signIn,
        logOut,
        resetPassword,
        sendVerificationEmail,
        changePassword,
        updateUserProfile,
        refreshUser
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;