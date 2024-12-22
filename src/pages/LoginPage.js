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
      <p style={styles.tagline}>Rank your kids like an Uber Driver!</p>
      
      <button style={styles.button} onClick={handleLogin}>
        <img 
          src="https://img.icons8.com/color/20/000000/google-logo.png" 
          alt="Google logo" 
          style={styles.googleIcon} 
        />
        Login with Google
      </button>
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
  tagline: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '30px',
    fontWeight: '400'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease'
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  }
};

export default LoginPage;
