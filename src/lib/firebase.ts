import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuYn6MVqrch4WwXt3Ix6MPoID7JW0pqOY",
  authDomain: "impulse-5a26e.firebaseapp.com",
  projectId: "impulse-5a26e",
  storageBucket: "impulse-5a26e.firebasestorage.app",
  messagingSenderId: "495258042522",
  appId: "1:495258042522:web:ab9caf75d0a42a2539df23",
  measurementId: "G-K5LXN1EP0R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
