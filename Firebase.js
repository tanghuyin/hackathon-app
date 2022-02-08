// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAYFwLOLQqnx30XqA6cL8rbFFKtyTxa0ls',
  authDomain: 'fir-auth-2a909.firebaseapp.com',
  projectId: 'fir-auth-2a909',
  storageBucket: 'fir-auth-2a909.appspot.com',
  messagingSenderId: '144429080318',
  appId: '1:144429080318:web:79576a5019feb947468faf',
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
};
