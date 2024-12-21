import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';

function LoginPage() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User Info:', result.user);
      alert(`Welcome, ${result.user.displayName}!`);
    } catch (error) {
      console.error('Login Failed:', error.message);
    }
  };

  return (
    <div>
      <h1>Welcome to Starboard!</h1>
      <p>Sign in to start ranking!</p>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default LoginPage;
