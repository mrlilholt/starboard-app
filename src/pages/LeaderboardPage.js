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
    <div style={styles.modalOverlay}>
<div style={styles.modal}>
    <div style={styles.page}>
      <div style={styles.topBar}>
        <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />
        <div style={styles.rightSection}>
          <div style={styles.menuIcon} onClick={toggleMenu}>
            ☰
          </div>
          <img
            src={auth.currentUser?.photoURL}
            alt="User"
            style={styles.userIcon}
          />
        </div>
      </div>

      {menuOpen && (
        <div style={styles.menuDropdown}>
          <Link to="/dashboard" style={styles.menuItem}>Dashboard</Link>
          <Link to="/stats" style={styles.menuItem}>Stats</Link>
          <Link to="/about" style={styles.menuItem}>About</Link>
          <div style={styles.menuItem} onClick={logout}>Logout</div>
        </div>
      )}

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
    </div>
    </div>
  );
}

const styles = {
  page: {
    textAlign: 'center',
    padding: '20px',
  },
  logo: {
    width: '120px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: '2rem',
    cursor: 'pointer',
    marginRight: '10px',
  },
  userIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginLeft: '10px',
    objectFit: 'cover',  // Ensures the image fits the container
  },
  modalOverlay: {
    position: 'fixed',   
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dim the background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',  
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',  
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',  
  },
  
  menuDropdown: {
    position: 'absolute',
    top: '80px',
    right: '10px',
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
  leaderboardWrapper: {
    marginTop: '80px',  // Increase margin to push content below topBar
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',  // Add padding to ensure spacing
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'sticky',   // Ensure top bar stays fixed
    top: 0,
    backgroundColor: '#fff',
    zIndex: 50,
  },

  pageTitle: {
    fontSize: '2.5rem',
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
