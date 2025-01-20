import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApQNqkaP6BazjF7lmx0sFhItoy6DfDjec",
    authDomain: "torneio-97841.firebaseapp.com",
    projectId: "torneio-97841",
    storageBucket: "torneio-97841.firebasestorage.app",
    messagingSenderId: "618591947829",
    appId: "1:618591947829:web:a7119768207be7bbe3357c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };