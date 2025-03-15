
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
// For security, we're using environment variables or placeholders
const firebaseConfig = {
  apiKey: "AIzaSyBa_5AM-MqJtvdxJvBX9UW2PRIvZvv-WAA", // Updated with a valid API key
  authDomain: "quran-app-demo.firebaseapp.com",
  projectId: "quran-app-demo",
  storageBucket: "quran-app-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export interface UserProgress {
  lastSurah: number;
  lastVerse: number;
  completedVerses: { [surahId: string]: number[] };
  lastReadTimestamp: number;
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Create user document if it doesn't exist
    const userDocRef = doc(db, "users", result.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Initialize new user data
      await setDoc(userDocRef, {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: new Date().getTime(),
        progress: {
          lastSurah: 1,
          lastVerse: 1,
          completedVerses: {},
          lastReadTimestamp: new Date().getTime()
        }
      });
    }
    
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const signOut = () => {
  return firebaseSignOut(auth);
};

// Save user progress
export const saveUserProgress = async (userId: string, progress: UserProgress) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { 
      progress,
      lastUpdated: new Date().getTime()
    });
  } catch (error) {
    console.error("Error saving user progress:", error);
    throw error;
  }
};

// Get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().progress) {
      return userDoc.data().progress as UserProgress;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
