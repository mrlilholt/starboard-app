import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const kids = [
  { id: 1, name: 'Mira', image: '/mira.png' },
  { id: 2, name: 'Shea', image: '/shea.png' }
];

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribers = [];

    kids.forEach((kid) => {
      const docRef = doc(db, 'stars', kid.name);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        const totalStars = docSnap.exists()
          ? Object.values(docSnap.data()).reduce(
              (acc, val) => (typeof val === 'number' ? acc + val : acc),
              0
            )
          : 0;

        setLeaderboard((prev) => {
          const updated = prev.filter((item) => item.id !== kid.id);
          return [...updated, { ...kid, totalStars }].sort(
            (a, b) => b.totalStars - a.totalStars
          );
        });
      });
      unsubscribers.push(unsubscribe);
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />

        <div style={styles.rightSection}>
          <div style={styles.menuIcon} onClick={toggleMenu}>
            ☰
          </div>

          {menuOpen && (
            <div style={styles.menuDropdown}>
              <Link to="/dashboard" style={styles.menuItem}>Dashboard</Link>
              <Link to="/stats" style={styles.menuItem}>Stats</Link>
              <Link to="/about" style={styles.menuItem}>About</Link>
              <div style={styles.menuItem} onClick={logout}>Logout</div>
            </div>
          )}
          <img src={auth.currentUser?.photoURL} alt="User" style={styles.userIcon} />
        </div>
      </header>

      <div style={styles.leaderboardWrapper}>
        <h1 style={styles.pageTitle}>🏆 Leaderboard 🏆</h1>

        <div style={styles.leaderboard}>
          {leaderboard.map((kid, index) => (
            <div key={kid.id} style={styles.card}>
              <img src={kid.image} alt={kid.name} style={styles.kidImage} />
              <h2>{kid.name}</h2>
              <p style={styles.starCount}>
                {kid.totalStars} ⭐
              </p>
              {index === 0 && <p style={styles.leader}>🏅 Current Leader!</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '140px',  // Ensures content is fully below header
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '90px',  // Adjust header height
    backgroundColor: 'white',
    zIndex: 1000,
    padding: '10px 20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: '120px',
  },
  menuIcon: {
    fontSize: '2rem',
    cursor: 'pointer',
    marginRight: '10px',
  },
  menuDropdown: {
    position: 'absolute',
    top: '60px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 100,
  },
  menuItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    display: 'block',
  },
  userIcon: {
    width: '50px',  // Slightly larger to avoid cutoff
    height: '50px',
    borderRadius: '50%',
    marginLeft: '10px',
  },
  leaderboardWrapper: {
    marginTop: '20px',
  },
  pageTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  card: {
    width: '90%',
    maxWidth: '400px',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  kidImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginBottom: '15px',
  },
  starCount: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  leader: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

export default LeaderboardPage;
