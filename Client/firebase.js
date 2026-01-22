import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "biteroute-78a5d.firebaseapp.com",
  projectId: "biteroute-78a5d",
  storageBucket: "biteroute-78a5d.firebasestorage.app",
  messagingSenderId: "136744717412",
  appId: "1:136744717412:web:088a6e6539f6bdf0282371",
  measurementId: "G-KE53LZZQGH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
