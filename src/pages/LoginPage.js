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
      navigate('/dashboard');  // Redirect after successful login
    } catch (error) {
      console.error('Login Failed:', error.message);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />
      <h1>Welcome to Starboard!</h1>
      <button style={styles.button} onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

// Basic CSS-in-JS for quick styling
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center'
  },
  logo: {
    width: '300px',
    marginBottom: '20px'
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease'
  }
};

export default LoginPage;
