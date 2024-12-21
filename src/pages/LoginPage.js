import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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

      alert(`Welcome, ${user.displayName}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Failed:', error.message);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Starboard</h1>
      <p style={styles.subtitle}>Sign in to start ranking your kids!</p>
      <button onClick={handleLogin} style={styles.button}>
        Login with Google 🚀
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#121212',
    color: '#fff',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1rem',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
};

export default LoginPage;
