import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, browserSessionPersistence, setPersistence  } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDYy-h2bVD8bdN09NPvjJn3psIh-Y47YZk",
  authDomain: "lingocamp-2d4fc.firebaseapp.com",
  projectId: "lingocamp-2d4fc",
  storageBucket: "lingocamp-2d4fc.firebasestorage.app",
  messagingSenderId: "937454400779",
  appId: "1:937454400779:web:c17de92969c1ab51215e0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

(async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      console.log("Session persistence enabled");
    } catch (error) {
      console.error("Error setting persistence:", error);
    }
  })();

export { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup, db, storage };
