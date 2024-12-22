import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Create a new user if not found
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          role: 'parent',
          photoURL: user.photoURL,
          uid: user.uid
        });
      }

      alert(`Welcome, ${user.displayName}!`);
      navigate('/dashboard');  // <-- Redirect after successful login
    } catch (error) {
      console.error('Login Failed:', error.message);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div>
      <h1>Welcome to Starboard!</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default LoginPage;
