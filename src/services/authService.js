import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
} from 'firebase/auth';

export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  // Implement Google Sign-In for React Native (e.g., using @react-native-google-signin/google-signin)
  // This is a placeholder
  console.warn('Google Sign-In not implemented');
  return Promise.reject('Google Sign-In not implemented');
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback) => {
  return onFirebaseAuthStateChanged(auth, callback);
};
