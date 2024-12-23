import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
    const fetchData = async () => {
      const data = await Promise.all(
        kids.map(async (kid) => {
          const docRef = doc(db, 'stars', kid.name);
          const docSnap = await getDoc(docRef);
          const totalStars = docSnap.exists()
            ? Object.values(docSnap.data()).reduce(
                (acc, val) => (typeof val === 'number' ? acc + val : acc),
                0
              )
            : 0;
          return { ...kid, totalStars };
        })
      );

      // Sort by total stars (highest first)
      data.sort((a, b) => b.totalStars - a.totalStars);
      setLeaderboard(data);
    };

    fetchData();
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
      {/* HEADER WITH MENU */}
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
              <Link to="/leaderboard" style={styles.menuItem}>Leaderboard</Link>
              <Link to="/about" style={styles.menuItem}>About</Link>
              <div style={styles.menuItem} onClick={logout}>Logout</div>
            </div>
          )}

          <img
            src={auth.currentUser?.photoURL}
            alt="User"
            style={styles.userIcon}
          />
        </div>
      </header>

      <h1>🏆 Leaderboard 🏆</h1>
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
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  logo: {
    width: '150px'
  },
  menuIcon: {
    fontSize: '2rem',
    cursor: 'pointer',
    marginRight: '20px'
  },
  menuDropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 100
  },
  menuItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    display: 'block'
  },
  userIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginLeft: '10px'
  },
  leaderboard: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px'
  },
  card: {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '300px',
    textAlign: 'center',
    backgroundColor: '#fff'
  },
  kidImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '15px'
  },
  starCount: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  leader: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default LeaderboardPage;
