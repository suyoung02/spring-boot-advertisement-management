import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log({ firebaseConfig });

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const storage = getStorage(app, 'gs://poetic-tube-407505.appspot.com');

const storageRef = (url: string) => ref(storage, url);

const uploadFile = (file: Blob, storageRef: StorageReference) => {
  return uploadBytes(storageRef, file)
    .then((res) => {
      console.log('Uploaded a blob or file!');
      return res;
    })
    .catch((e) => {
      console.log('Upload fail!', e);
      return null;
    });
};

const getImageUrl = (storageRef: StorageReference) => {
  return getDownloadURL(storageRef)
    .then((url: string) => {
      return url;
      // Insert url into an <img> tag to "download"
    })
    .catch(() => '');
};

export { storage, uploadFile, storageRef, getImageUrl };
