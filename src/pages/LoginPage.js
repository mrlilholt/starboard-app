import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

function LoginPage() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User Logged In:', user);
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          role: 'parent',
          photoURL: user.photoURL,
          uid: user.uid
        });
      }

      console.log('Redirecting to dashboard...');
      window.location.href = '/dashboard';  // Force redirect after login
    } catch (error) {
      console.error('Full Error:', error);  // Log full error for debugging
      alert(`Failed to sign in. Reason: ${error.message}`);  // Show error to user
    }
  };

  return (
    <div className="app-container">
      <h1>Welcome to Starboard!</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default LoginPage;
