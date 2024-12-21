import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');  // Redirect to login page after logout
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>
      <p style={styles.subtitle}>Track your family's star rankings here.</p>

      <div style={styles.card}>
        <h2>Mira</h2>
        <p>⭐ ⭐ ⭐ ⭐ ⭐</p>
      </div>

      <div style={styles.card}>
        <h2>Shay</h2>
        <p>⭐ ⭐ ⭐ ⭐</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '50px',
    backgroundColor: '#1E1E1E',
    color: '#fff',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#E63946',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  card: {
    padding: '20px',
    backgroundColor: '#333',
    borderRadius: '12px',
    margin: '20px 0',
  },
};

export default Dashboard;
