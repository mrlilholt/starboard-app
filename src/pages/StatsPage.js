import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const mockStats = {
  Mira: {
    Cleaning: 4,
    Kindness: 5,
    Listening: 3,
  },
  Shea: {
    Helping: 5,
    Sharing: 4,
    Kindness: 2,
  }
};

function StatsPage() {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Simulate fetching stats from a backend or Firestore
    console.log('Fetching stats...');
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />
        <div style={styles.userSection}>
          <img src={auth.currentUser?.photoURL} alt="User" style={styles.userIcon} />
          <button onClick={logout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>
      
      <h1>Behavior Stats</h1>
      <div style={styles.statsContainer}>
        {Object.entries(stats).map(([kid, categories]) => (
          <div key={kid} style={styles.card}>
            <h2>{kid}</h2>
            {Object.entries(categories).map(([category, rating]) => (
              <p key={category}>{category}: {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
    boxSizing: 'border-box'
  },
  logo: {
    width: '120px',
    height: 'auto'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center'
  },
  userIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px'
  },
  logoutButton: {
    padding: '8px 12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '800px',
    margin: '20px 0'
  },
  card: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: 'white'
  }
};

export default StatsPage;
