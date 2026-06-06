import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const customConfig = {
  ...firebaseConfig,
  authDomain: 'sitelog-two.vercel.app'
};

const app = initializeApp(customConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, customConfig.firestoreDatabaseId);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    alert(`Sign-in failed: ${error.message} \n\nIf you recently deployed, please ensure the URL is added to the "Authorized domains" list in your Firebase Console (Authentication > Settings).`);
  }
};
