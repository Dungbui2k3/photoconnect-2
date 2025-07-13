import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const bookingsCollection = collection(db, 'bookings');

export const createBooking = (bookingData) => {
  return addDoc(bookingsCollection, bookingData);
};

export const getBooking = (bookingId, callback) => {
  const bookingDoc = doc(db, 'bookings', bookingId);
  return onSnapshot(bookingDoc, (doc) => {
    callback({ id: doc.id, ...doc.data() });
  });
};

export const getBookingsForUser = (userId, callback) => {
  const q = query(bookingsCollection, where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(bookings);
  });
};

export const getBookingsForPhotographer = (photographerId, callback) => {
  const q = query(bookingsCollection, where('photographerId', '==', photographerId));
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(bookings);
  });
};

export const updateBookingStatus = (bookingId, status) => {
  const bookingDoc = doc(db, 'bookings', bookingId);
  return updateDoc(bookingDoc, { status });
};

export const updateBookingDeliverables = (bookingId, deliverableUrl) => {
  const bookingDoc = doc(db, 'bookings', bookingId);
  return updateDoc(bookingDoc, {
    deliverables: arrayUnion(deliverableUrl),
  });
};
