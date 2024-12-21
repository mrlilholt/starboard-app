import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // If not, create a new user document
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        role: 'parent',  // Default role
        photoURL: user.photoURL,
        uid: user.uid
      });
    }

    alert(`Welcome, ${user.displayName}!`);
  } catch (error) {
    console.error('Login Failed:', error.message);
    alert('Failed to sign in. Please try again.');
  }
};

export default LoginPage;
