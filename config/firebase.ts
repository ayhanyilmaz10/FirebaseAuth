import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcCofEaGaoBKWzaZXjl3DCqeLhDJjyFBI",
  authDomain: "authtest-3f1ce.firebaseapp.com",
  projectId: "authtest-3f1ce",
  storageBucket: "authtest-3f1ce.firebasestorage.app",
  messagingSenderId: "1012155326482",
  appId: "1:1012155326482:web:9aaa141463af0114cff8cb",
  measurementId: "G-W20LBG3NJZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);