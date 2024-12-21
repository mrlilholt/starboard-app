import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();

function LoginPage() {
  const navigate = useNavigate();  // Use navigate for redirection

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          role: 'parent',  // Default role
          photoURL: user.photoURL,
          uid: user.uid
        });
      }

      alert(`Welcome, ${user.displayName}!`);
      navigate('/dashboard');  // Redirect to dashboard after successful login
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
