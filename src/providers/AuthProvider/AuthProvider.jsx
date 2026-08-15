import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
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
    // send a password reset email (Firebase handles the actual reset flow/page)
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
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
        setUser({ ...auth.currentUser })
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