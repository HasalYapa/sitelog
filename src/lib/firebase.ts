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
    
    if (error.code === 'auth/popup-closed-by-user') {
      // User closed the popup, no need to alert them
      return;
    }
    
    if (error.code === 'auth/unauthorized-domain') {
      alert("Sign-in failed: Unauthorized domain.\n\nPlease go to Firebase Console > Authentication > Settings > Authorized Domains and add 'sitelog-two.vercel.app' to the list.");
      return;
    }

    alert(`Sign-in failed: ${error.message}\n\nMake sure your Firebase 'authDomain' is correct (usually your-project.firebaseapp.com) and your vercel URL is added to Authorized Domains in Firebase console.`);
  }
};
