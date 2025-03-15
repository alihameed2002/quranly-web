// This file is deprecated as we're now using Supabase for authentication
// Keeping it for reference but it's no longer used in the application

/*
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration is deprecated as we moved to Supabase
const firebaseConfig = {
  apiKey: "DEPRECATED",
  authDomain: "DEPRECATED",
  projectId: "DEPRECATED",
  storageBucket: "DEPRECATED",
  messagingSenderId: "DEPRECATED",
  appId: "DEPRECATED"
};

export interface UserProgress {
  lastSurah: number;
  lastVerse: number;
  completedVerses: { [surahId: string]: number[] };
  lastReadTimestamp: number;
}

// All Firebase functionality has been moved to Supabase implementations
*/
