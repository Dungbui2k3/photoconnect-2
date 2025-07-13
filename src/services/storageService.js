import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';
import { updateBookingDeliverables } from './bookingService';

export const uploadImage = async (uri, path) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, blob);
};

export const getDownloadURL = (path) => {
  const storageRef = ref(storage, path);
  return getStorageDownloadURL(storageRef);
};

export const uploadDeliverable = async (bookingId, file) => {
  const response = await fetch(file.uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `deliverables/${bookingId}/${file.name}`);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getStorageDownloadURL(storageRef);
  return updateBookingDeliverables(bookingId, downloadURL);
};
