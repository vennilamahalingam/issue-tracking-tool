// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfRWI0As5g-cmYSChmigYPKP_O6DHDN1E",
  authDomain: "issue-tracking-tool-8d17f.firebaseapp.com",
  projectId: "issue-tracking-tool-8d17f",
  storageBucket: "issue-tracking-tool-8d17f.appspot.com",
  messagingSenderId: "1072938460386",
  appId: "1:1072938460386:web:fa3566627402cc198b2abb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();