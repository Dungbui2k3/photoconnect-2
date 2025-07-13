import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const createUserProfile = (userId, data) => {
  const userDoc = doc(usersCollection, userId);
  return setDoc(userDoc, data);
};

export const getUserProfile = (userId) => {
  const userDoc = doc(usersCollection, userId);
  return getDoc(userDoc);
};

export const onUserProfileChange = (userId, callback) => {
  const userDoc = doc(usersCollection, userId);
  return onSnapshot(userDoc, callback);
};

export const updateUserProfile = (userId, data) => {
  const userDoc = doc(usersCollection, userId);
  return setDoc(userDoc, data, { merge: true });
};

export const searchPhotographers = (queryText, callback) => {
  const lowercasedQuery = queryText.toLowerCase();
  const q = query(
    usersCollection,
    where('role', '==', 'photographer'),
    where('name_lowercase', '>=', lowercasedQuery),
    where('name_lowercase', '<=', lowercasedQuery + '\uf8ff')
  );

  return onSnapshot(q, (snapshot) => {
    const photographers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(photographers);
  });
};
