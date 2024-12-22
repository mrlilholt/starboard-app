import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StatsPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Stats Overview</h1>
        <div style={styles.menuContainer}>
          <button onClick={toggleMenu} style={styles.menuButton}>☰</button>
          {menuOpen && (
            <div style={styles.dropdownMenu}>
              <p onClick={() => navigateTo('/dashboard')} style={styles.menuItem}>Dashboard</p>
              <p onClick={() => navigateTo('/stats')} style={styles.menuItem}>Stats</p>
              <p onClick={() => navigateTo('/about')} style={styles.menuItem}>About</p>
            </div>
          )}
        </div>
      </header>

      <div style={styles.content}>
        <p>Here you can see the cumulative ratings for your children.</p>
        {/* Placeholder for future stats visualization */}
        <p>Coming soon...</p>
      </div>

      <button onClick={() => navigate('/dashboard')} style={styles.backButton}>Back to Dashboard</button>
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
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  content: {
    marginBottom: '20px'
  },
  backButton: {
    marginTop: '30px',
    padding: '12px 24px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  menuContainer: {
    position: 'relative'
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: '2.5rem',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  menuItem: {
    padding: '10px 20px',
    cursor: 'pointer'
  }
};

export default StatsPage;
