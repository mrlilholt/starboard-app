import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

function LoginPage() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User Logged In:', user);  // Confirm login
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
      window.location.href = '/dashboard';  // Force redirect
    } catch (error) {
      console.error('Login Failed:', error.message);
      alert('Failed to sign in. Please try again.');
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
