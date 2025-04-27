import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZARq_WTAMWeIN-qPx9qJRd3fFLQYaOyM",
  authDomain: "ems-p2.firebaseapp.com",
  projectId: "ems-p2",
  storageBucket: "ems-p2.firebasestorage.app",
  messagingSenderId: "247384148684",
  appId: "1:247384148684:web:4ba15833adc649cf171069",
  measurementId: "G-GSGN8WRJLD"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };